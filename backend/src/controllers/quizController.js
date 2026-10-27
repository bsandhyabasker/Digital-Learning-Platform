const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { recalculateStudentPerformance } = require('../services/performanceService');
const { sendNotification, sendBulkNotifications } = require('../services/notificationService');

// @desc    Get quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
exports.getQuizzesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const quizzes = await Quiz.find({ courseId })
      .populate('facultyId', 'name email avatar')
      .sort({ dueDate: 1 });

    let enrichedQuizzes = quizzes.map((q) => q.toObject());

    if (req.user.role === 'student') {
      // Check which quizzes student has attempted
      const attempts = await QuizAttempt.find({
        courseId,
        studentId: req.user.id
      });

      const attemptMap = {};
      attempts.forEach((att) => {
        attemptMap[att.quizId.toString()] = att;
      });

      enrichedQuizzes = enrichedQuizzes.map((quiz) => {
        // Strip correctOptionIndex for unattempted quiz in listing
        const myAttempt = attemptMap[quiz._id.toString()] || null;
        return {
          ...quiz,
          questionsCount: quiz.questions.length,
          questions: myAttempt ? quiz.questions : undefined, // Hide questions from listing if not taken
          myAttempt,
          isCompleted: !!myAttempt
        };
      });
    } else {
      // Faculty view: attach completion count
      const attemptStats = await QuizAttempt.aggregate([
        { $match: { courseId: quizzes.length ? quizzes[0].courseId : null } },
        {
          $group: {
            _id: '$quizId',
            attemptsCount: { $sum: 1 },
            avgScore: { $avg: '$percentage' }
          }
        }
      ]);

      const statMap = {};
      attemptStats.forEach((s) => {
        statMap[s._id.toString()] = s;
      });

      enrichedQuizzes = enrichedQuizzes.map((quiz) => ({
        ...quiz,
        attemptsCount: statMap[quiz._id.toString()]?.attemptsCount || 0,
        averageScore: Math.round(statMap[quiz._id.toString()]?.avgScore || 0)
      }));
    }

    res.json({
      success: true,
      count: enrichedQuizzes.length,
      quizzes: enrichedQuizzes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('courseId', 'title courseCode')
      .populate('facultyId', 'name email avatar');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let myAttempt = null;
    let quizData = quiz.toObject();

    if (req.user.role === 'student') {
      myAttempt = await QuizAttempt.findOne({
        quizId: quiz._id,
        studentId: req.user.id
      });

      // If student hasn't taken it yet, hide correct answers!
      if (!myAttempt) {
        quizData.questions = quizData.questions.map((q) => ({
          _id: q._id,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options,
          points: q.points
        }));
      }
    }

    res.json({
      success: true,
      quiz: quizData,
      myAttempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private (Faculty, Admin)
exports.createQuiz = async (req, res, next) => {
  try {
    const { courseId, title, description, timeLimitMinutes, passPercentage, dueDate, questions } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const totalPoints = (questions || []).reduce((acc, q) => acc + (q.points || 10), 0);

    const quiz = await Quiz.create({
      courseId,
      facultyId: req.user.id,
      title,
      description,
      timeLimitMinutes: timeLimitMinutes || 20,
      totalPoints: totalPoints || 100,
      passPercentage: passPercentage || 60,
      dueDate,
      questions: questions || []
    });

    // Notify students
    const enrollments = await Enrollment.find({ courseId, status: 'active' });
    const studentIds = enrollments.map((e) => e.studentId);

    await sendBulkNotifications(studentIds, {
      senderId: req.user.id,
      title: 'New Quiz Published',
      message: `"${title}" has been scheduled in ${course.title}. Total questions: ${questions?.length || 0}.`,
      type: 'quiz',
      link: `/student/courses/${courseId}`
    });

    res.status(201).json({
      success: true,
      quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit student quiz answers and auto-grade
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student)
exports.submitQuizAttempt = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { answers, timeSpentSeconds } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Check if student already attempted
    const existingAttempt = await QuizAttempt.findOne({
      quizId,
      studentId: req.user.id
    });

    if (existingAttempt) {
      return res.status(400).json({ success: false, message: 'You have already submitted an attempt for this quiz.' });
    }

    // Auto-grading logic
    let totalScoreObtained = 0;
    let totalPossible = 0;
    const gradedAnswers = [];

    quiz.questions.forEach((question, idx) => {
      const qPoints = question.points || 10;
      totalPossible += qPoints;

      const studentAns = answers.find(
        (a) => (a.questionId && a.questionId.toString() === question._id.toString()) || a.questionIndex === idx
      );

      const selectedOpt = studentAns ? studentAns.selectedOption : null;
      const isCorrect = selectedOpt !== null && selectedOpt === question.correctOptionIndex;
      const pointsAwarded = isCorrect ? qPoints : 0;

      totalScoreObtained += pointsAwarded;

      gradedAnswers.push({
        questionId: question._id,
        selectedOption: selectedOpt,
        isCorrect,
        pointsAwarded
      });
    });

    const percentage = totalPossible > 0 ? Math.round((totalScoreObtained / totalPossible) * 100) : 0;
    const passed = percentage >= (quiz.passPercentage || 60);

    const attempt = await QuizAttempt.create({
      quizId,
      studentId: req.user.id,
      courseId: quiz.courseId,
      timeSpentSeconds: timeSpentSeconds || 0,
      answers: gradedAnswers,
      scoreObtained: totalScoreObtained,
      totalPossibleScore: totalPossible,
      percentage,
      passed
    });

    // Recalculate Student Performance & GPA
    await recalculateStudentPerformance(req.user.id, quiz.courseId);

    // Send notification
    await sendNotification({
      recipientId: req.user.id,
      title: 'Quiz Evaluated',
      message: `You scored ${percentage}% (${totalScoreObtained}/${totalPossible} pts) on "${quiz.title}". Status: ${passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}.`,
      type: 'quiz',
      link: `/student/courses/${quiz.courseId}`
    });

    res.status(201).json({
      success: true,
      message: `Quiz completed successfully. Score: ${percentage}%`,
      attempt,
      quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get results of all students for a quiz
// @route   GET /api/quizzes/:id/results
// @access  Private (Faculty, Admin)
exports.getQuizResults = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ quizId: req.params.id })
      .populate('studentId', 'name email avatar studentId department')
      .sort({ scoreObtained: -1 });

    const quiz = await Quiz.findById(req.params.id);

    res.json({
      success: true,
      quiz,
      count: attempts.length,
      attempts
    });
  } catch (error) {
    next(error);
  }
};
