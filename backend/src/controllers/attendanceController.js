const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { recalculateStudentPerformance } = require('../services/performanceService');

// @desc    Get attendance sessions for a course
// @route   GET /api/attendance/course/:courseId
// @access  Private
exports.getCourseAttendance = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const sessions = await Attendance.find({ courseId })
      .populate('records.studentId', 'name email avatar studentId')
      .sort({ sessionDate: -1 });

    const totalSessions = sessions.length;

    // If student, compute their personalized attendance stats
    let studentStats = null;
    if (req.user.role === 'student') {
      let present = 0;
      let late = 0;
      let absent = 0;
      let excused = 0;

      const myRecords = [];

      sessions.forEach((sess) => {
        const myRecord = sess.records.find(
          (r) => r.studentId?._id?.toString() === req.user.id || r.studentId?.toString() === req.user.id
        );
        if (myRecord) {
          if (myRecord.status === 'present') present += 1;
          else if (myRecord.status === 'late') late += 1;
          else if (myRecord.status === 'absent') absent += 1;
          else if (myRecord.status === 'excused') excused += 1;

          myRecords.push({
            sessionId: sess._id,
            sessionDate: sess.sessionDate,
            topicCovered: sess.topicCovered,
            status: myRecord.status,
            remarks: myRecord.remarks
          });
        }
      });

      const effectivePresent = present + (late * 0.75) + excused;
      const percentage = totalSessions > 0 ? Math.round((effectivePresent / totalSessions) * 100) : 100;

      studentStats = {
        totalSessions,
        present,
        late,
        absent,
        excused,
        percentage,
        records: myRecords
      };
    }

    res.json({
      success: true,
      totalSessions,
      sessions,
      studentStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Log attendance session for a class
// @route   POST /api/attendance/session
// @access  Private (Faculty, Admin)
exports.saveAttendanceSession = async (req, res, next) => {
  try {
    const { courseId, sessionDate, topicCovered, durationHours, records } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const session = await Attendance.create({
      courseId,
      facultyId: req.user.id,
      sessionDate: sessionDate || new Date(),
      topicCovered: topicCovered || 'Regular Class Lecture',
      durationHours: durationHours || 1.5,
      records: records || []
    });

    // Asynchronously recalculate performance for all students in this session
    if (records && records.length > 0) {
      for (const record of records) {
        await recalculateStudentPerformance(record.studentId, courseId);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Attendance sheet saved and student performance metrics updated.',
      session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's overall attendance across all enrolled courses
// @route   GET /api/attendance/my-summary
// @access  Private (Student)
exports.getMyAttendanceSummary = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user.id, status: 'active' })
      .populate('courseId', 'title courseCode thumbnail');

    const courseSummaries = [];
    let totalAllSessions = 0;
    let totalAllAttended = 0;

    for (const enr of enrollments) {
      if (!enr.courseId) continue;
      const sessions = await Attendance.find({ courseId: enr.courseId._id });
      let present = 0;
      let late = 0;
      let absent = 0;

      sessions.forEach((s) => {
        const rec = s.records.find((r) => r.studentId.toString() === req.user.id);
        if (rec) {
          if (rec.status === 'present' || rec.status === 'excused') present += 1;
          else if (rec.status === 'late') late += 1;
          else if (rec.status === 'absent') absent += 1;
        }
      });

      const effective = present + (late * 0.75);
      const total = sessions.length;
      const pct = total > 0 ? Math.round((effective / total) * 100) : 100;

      totalAllSessions += total;
      totalAllAttended += effective;

      courseSummaries.push({
        course: enr.courseId,
        totalSessions: total,
        present,
        late,
        absent,
        percentage: pct,
        isAtRisk: pct < 75
      });
    }

    const overallPct = totalAllSessions > 0 ? Math.round((totalAllAttended / totalAllSessions) * 100) : 100;

    res.json({
      success: true,
      overallPercentage: overallPct,
      isOverallAtRisk: overallPct < 75,
      courseSummaries
    });
  } catch (error) {
    next(error);
  }
};
