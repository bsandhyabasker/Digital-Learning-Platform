const Submission = require('../models/Submission');
const QuizAttempt = require('../models/QuizAttempt');
const Attendance = require('../models/Attendance');
const Performance = require('../models/Performance');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const { sendNotification } = require('./notificationService');

const recalculateStudentPerformance = async (studentId, courseId) => {
  try {
    // 1. Calculate Assignment Average
    const gradedSubmissions = await Submission.find({
      studentId,
      courseId,
      status: 'graded',
      grade: { $ne: null }
    }).populate('assignmentId');

    let assignmentAvg = 0;
    if (gradedSubmissions.length > 0) {
      const totalAssignmentScores = gradedSubmissions.reduce((acc, sub) => {
        const max = sub.assignmentId?.maxScore || 100;
        const percentage = (sub.grade / max) * 100;
        return acc + percentage;
      }, 0);
      assignmentAvg = Math.round(totalAssignmentScores / gradedSubmissions.length);
    }

    // 2. Calculate Quiz Average
    const quizAttempts = await QuizAttempt.find({
      studentId,
      courseId
    });

    let quizAvg = 0;
    if (quizAttempts.length > 0) {
      const totalQuizScores = quizAttempts.reduce((acc, att) => acc + (att.percentage || 0), 0);
      quizAvg = Math.round(totalQuizScores / quizAttempts.length);
    }

    // 3. Calculate Attendance Percentage
    const courseSessions = await Attendance.find({ courseId });
    let attendancePct = 100;

    if (courseSessions.length > 0) {
      let attendedCount = 0;
      let totalCourseSessionsForStudent = 0;

      courseSessions.forEach((session) => {
        const studentRecord = session.records.find(
          (r) => r.studentId.toString() === studentId.toString()
        );
        if (studentRecord) {
          totalCourseSessionsForStudent += 1;
          if (studentRecord.status === 'present') {
            attendedCount += 1;
          } else if (studentRecord.status === 'late') {
            attendedCount += 0.75;
          } else if (studentRecord.status === 'excused') {
            attendedCount += 1;
          }
        }
      });

      if (totalCourseSessionsForStudent > 0) {
        attendancePct = Math.round((attendedCount / totalCourseSessionsForStudent) * 100);
      }
    }

    // 4. Compute Weighted Overall Score (45% Assignments, 35% Quizzes, 20% Attendance)
    let overallScore = 0;
    if (gradedSubmissions.length > 0 || quizAttempts.length > 0) {
      const assignmentWeight = 0.45;
      const quizWeight = 0.35;
      const attendanceWeight = 0.20;

      overallScore = Math.round(
        (assignmentAvg * assignmentWeight) +
        (quizAvg * quizWeight) +
        (attendancePct * attendanceWeight)
      );
    } else {
      overallScore = attendancePct;
    }

    // Determine Risk Status
    let riskStatus = 'good_standing';
    if (attendancePct < 75 || overallScore < 60) {
      riskStatus = 'at_risk';
    } else if (attendancePct < 85 || overallScore < 75) {
      riskStatus = 'needs_attention';
    }

    // Update or create Performance record
    const performance = await Performance.findOneAndUpdate(
      { studentId, courseId },
      {
        assignmentAverage: assignmentAvg,
        quizAverage: quizAvg,
        attendancePercentage: attendancePct,
        overallScore,
        riskStatus,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    // Calculate Letter Grade
    let letterGrade = 'A';
    if (overallScore >= 90) letterGrade = 'A';
    else if (overallScore >= 80) letterGrade = 'B';
    else if (overallScore >= 70) letterGrade = 'C';
    else if (overallScore >= 60) letterGrade = 'D';
    else letterGrade = 'F';

    // Calculate course progress percentage based on completed modules, submitted assignments & taken quizzes
    const totalAssignments = await Assignment.countDocuments({ courseId, status: 'published' });
    const totalQuizzes = await Quiz.countDocuments({ courseId, status: 'published' });
    const submittedAssignmentsCount = await Submission.countDocuments({ studentId, courseId });
    const completedQuizzesCount = await QuizAttempt.countDocuments({ studentId, courseId });

    const totalTasks = (totalAssignments || 1) + (totalQuizzes || 1);
    const completedTasks = submittedAssignmentsCount + completedQuizzesCount;
    const progressPercent = Math.min(100, Math.round((completedTasks / totalTasks) * 100));

    // Update Enrollment
    await Enrollment.findOneAndUpdate(
      { studentId, courseId },
      {
        finalGrade: overallScore,
        letterGrade,
        progressPercent
      }
    );

    // Trigger alert notification if student enters 'at_risk' status
    if (riskStatus === 'at_risk') {
      const course = await Course.findById(courseId);
      await sendNotification({
        recipientId: studentId,
        title: 'Academic Alert: Attention Needed',
        message: `Your current standing in "${course?.title || 'your course'}" is below 75% attendance or 60% overall. Please review assignments and consult faculty.`,
        type: 'attendance_alert',
        link: `/student/courses/${courseId}`
      });
    }

    return performance;
  } catch (error) {
    console.error('[Performance Recalculation Error]', error);
  }
};

module.exports = { recalculateStudentPerformance };
