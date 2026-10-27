const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { recalculateStudentPerformance } = require('../services/performanceService');
const { sendNotification } = require('../services/notificationService');

// @desc    Submit or update assignment solution
// @route   POST /api/submissions
// @access  Private (Student)
exports.submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId, submissionText, fileUrl, repoUrl } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const now = new Date();
    const isLate = now > new Date(assignment.dueDate);

    if (isLate && !assignment.allowLateSubmissions) {
      return res.status(400).json({ success: false, message: 'Submission deadline has passed and late submissions are disabled.' });
    }

    const submission = await Submission.findOneAndUpdate(
      { assignmentId, studentId: req.user.id },
      {
        courseId: assignment.courseId,
        submissionText,
        fileUrl,
        repoUrl,
        submittedAt: now,
        isLate,
        status: 'submitted'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Notify Faculty
    const course = await Course.findById(assignment.courseId);
    await sendNotification({
      recipientId: assignment.facultyId,
      senderId: req.user.id,
      title: 'New Assignment Submission',
      message: `${req.user.name} submitted "${assignment.title}" in ${course?.title || 'course'}.`,
      type: 'assignment',
      link: `/faculty/courses/${assignment.courseId}`
    });

    res.status(201).json({
      success: true,
      message: isLate ? 'Assignment submitted late successfully.' : 'Assignment submitted successfully.',
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private (Faculty, Admin)
exports.getSubmissionsByAssignment = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
      .populate('studentId', 'name email avatar studentId department')
      .populate('gradedBy', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade a student submission
// @route   PUT /api/submissions/:id/grade
// @access  Private (Faculty, Admin)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { grade, facultyFeedback, rubricScores } = req.body;

    const submission = await Submission.findById(req.params.id)
      .populate('assignmentId')
      .populate('studentId', 'name email');

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.grade = Number(grade);
    submission.facultyFeedback = facultyFeedback || '';
    if (rubricScores) submission.rubricScores = rubricScores;
    submission.status = 'graded';
    submission.gradedBy = req.user.id;
    submission.gradedAt = new Date();

    await submission.save();

    // Recalculate Student Performance & GPA
    await recalculateStudentPerformance(submission.studentId._id, submission.courseId);

    // Send notification to student with grade update
    const maxScore = submission.assignmentId?.maxScore || 100;
    await sendNotification({
      recipientId: submission.studentId._id,
      senderId: req.user.id,
      title: 'Assignment Graded',
      message: `Your submission for "${submission.assignmentId?.title}" has been graded: ${grade}/${maxScore}.`,
      type: 'grade',
      link: `/student/courses/${submission.courseId}`
    });

    res.json({
      success: true,
      message: 'Submission graded successfully and performance metrics updated.',
      submission
    });
  } catch (error) {
    next(error);
  }
};
