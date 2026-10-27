const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { sendBulkNotifications } = require('../services/notificationService');

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
exports.getAssignmentsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const assignments = await Assignment.find({ courseId })
      .populate('facultyId', 'name email avatar')
      .sort({ dueDate: 1 });

    let enrichedAssignments = assignments.map((a) => a.toObject());

    if (req.user.role === 'student') {
      // Find current student submissions
      const submissions = await Submission.find({
        courseId,
        studentId: req.user.id
      });

      const subMap = {};
      submissions.forEach((s) => {
        subMap[s.assignmentId.toString()] = s;
      });

      enrichedAssignments = enrichedAssignments.map((assign) => ({
        ...assign,
        mySubmission: subMap[assign._id.toString()] || null,
        isSubmitted: !!subMap[assign._id.toString()],
        gradeStatus: subMap[assign._id.toString()]?.status || 'unsubmitted'
      }));
    } else {
      // Faculty/Admin view: attach submission counts
      const counts = await Submission.aggregate([
        { $match: { courseId: assignments.length ? assignments[0].courseId : null } },
        { $group: { _id: '$assignmentId', total: { $sum: 1 }, graded: { $sum: { $cond: [{ $eq: ['$status', 'graded'] }, 1, 0] } } } }
      ]);

      const countMap = {};
      counts.forEach((c) => {
        countMap[c._id.toString()] = c;
      });

      enrichedAssignments = enrichedAssignments.map((assign) => ({
        ...assign,
        submissionsCount: countMap[assign._id.toString()]?.total || 0,
        gradedCount: countMap[assign._id.toString()]?.graded || 0
      }));
    }

    res.json({
      success: true,
      count: enrichedAssignments.length,
      assignments: enrichedAssignments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assignment details
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('courseId', 'title courseCode')
      .populate('facultyId', 'name email avatar');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    let mySubmission = null;
    if (req.user.role === 'student') {
      mySubmission = await Submission.findOne({
        assignmentId: assignment._id,
        studentId: req.user.id
      });
    }

    res.json({
      success: true,
      assignment,
      mySubmission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Faculty, Admin)
exports.createAssignment = async (req, res, next) => {
  try {
    const { courseId, title, description, maxScore, weightage, dueDate, rubric, allowLateSubmissions } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const assignment = await Assignment.create({
      courseId,
      facultyId: req.user.id,
      title,
      description,
      maxScore: maxScore || 100,
      weightage: weightage || 20,
      dueDate,
      rubric: rubric || [],
      allowLateSubmissions: allowLateSubmissions !== undefined ? allowLateSubmissions : true
    });

    // Notify all enrolled students in the course
    const enrollments = await Enrollment.find({ courseId, status: 'active' });
    const studentIds = enrollments.map((e) => e.studentId);

    await sendBulkNotifications(studentIds, {
      senderId: req.user.id,
      title: 'New Assignment Published',
      message: `"${title}" has been posted in ${course.title}. Due on ${new Date(dueDate).toLocaleDateString()}.`,
      type: 'assignment',
      link: `/student/courses/${courseId}`
    });

    res.status(201).json({
      success: true,
      assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Faculty of course, Admin)
exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Faculty, Admin)
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    await Submission.deleteMany({ assignmentId: req.params.id });
    await assignment.deleteOne();

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
