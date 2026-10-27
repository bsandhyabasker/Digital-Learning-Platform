const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Performance = require('../models/Performance');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const { sendNotification } = require('../services/notificationService');

// @desc    Get all published courses (or all for faculty/admin)
// @route   GET /api/courses
// @access  Public / Private
exports.getCourses = async (req, res, next) => {
  try {
    const { category, level, facultyId, search, status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    } else if (!req.user || req.user.role === 'student') {
      query.status = 'published';
    }

    if (category) query.category = category;
    if (level) query.level = level;
    if (facultyId) query.facultyId = facultyId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('facultyId', 'name email avatar department bio')
      .sort({ createdAt: -1 });

    // Attach enrollment count to each course
    const courseIds = courses.map((c) => c._id);
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { courseId: { $in: courseIds }, status: 'active' } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    enrollmentCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const enrichedCourses = courses.map((course) => {
      const obj = course.toObject();
      obj.activeStudentsCount = countMap[course._id.toString()] || 0;
      return obj;
    });

    res.json({
      success: true,
      count: enrichedCourses.length,
      courses: enrichedCourses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('facultyId', 'name email avatar department bio');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if the current user is enrolled (if student)
    let enrollment = null;
    let performance = null;
    if (req.user && req.user.role === 'student') {
      enrollment = await Enrollment.findOne({
        courseId: course._id,
        studentId: req.user.id
      });
      performance = await Performance.findOne({
        courseId: course._id,
        studentId: req.user.id
      });
    }

    const activeEnrollmentCount = await Enrollment.countDocuments({
      courseId: course._id,
      status: 'active'
    });

    res.json({
      success: true,
      course,
      isEnrolled: !!enrollment && enrollment.status === 'active',
      enrollment,
      performance,
      activeStudentsCount: activeEnrollmentCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Faculty, Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const {
      courseCode,
      title,
      description,
      category,
      facultyId,
      thumbnail,
      capacity,
      credits,
      semester,
      level,
      syllabus,
      modules
    } = req.body;

    // Default facultyId to authenticated user if faculty
    const assignedFaculty = req.user.role === 'faculty' ? req.user.id : (facultyId || req.user.id);

    const existingCode = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    if (existingCode) {
      return res.status(400).json({ success: false, message: 'Course code already exists' });
    }

    const course = await Course.create({
      courseCode: courseCode.toUpperCase(),
      title,
      description,
      category: category || 'Computer Science',
      facultyId: assignedFaculty,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      capacity: capacity || 60,
      credits: credits || 4,
      semester: semester || 'Fall 2026',
      level: level || 'Intermediate',
      syllabus: syllabus || [],
      modules: modules || []
    });

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Faculty of course, Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (req.user.role !== 'admin' && course.facultyId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('facultyId', 'name email avatar department');

    res.json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin, Faculty of course)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (req.user.role !== 'admin' && course.facultyId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    await Enrollment.deleteMany({ courseId: req.params.id });

    res.json({
      success: true,
      message: 'Course and related enrollments deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll student in course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const activeCount = await Enrollment.countDocuments({ courseId: course._id, status: 'active' });
    if (activeCount >= course.capacity) {
      return res.status(400).json({ success: false, message: 'Course capacity has been reached' });
    }

    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId: course._id
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === 'active') {
        return res.status(400).json({ success: false, message: 'You are already actively enrolled in this course' });
      } else {
        // Re-activate dropped enrollment
        existingEnrollment.status = 'active';
        existingEnrollment.enrolledAt = new Date();
        await existingEnrollment.save();

        await sendNotification({
          recipientId: req.user.id,
          title: 'Enrollment Re-activated',
          message: `Welcome back to "${course.title}". Start exploring materials and assignments!`,
          type: 'enrollment',
          link: `/student/courses/${course._id}`
        });

        return res.json({ success: true, enrollment: existingEnrollment });
      }
    }

    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId: course._id,
      status: 'active',
      progressPercent: 0,
      finalGrade: 0,
      letterGrade: 'In Progress'
    });

    // Initialize baseline performance
    await Performance.create({
      studentId: req.user.id,
      courseId: course._id,
      assignmentAverage: 0,
      quizAverage: 0,
      attendancePercentage: 100,
      overallScore: 100,
      riskStatus: 'good_standing'
    });

    // Notify Student
    await sendNotification({
      recipientId: req.user.id,
      title: 'Course Enrollment Confirmed',
      message: `You have successfully enrolled in "${course.title}" (${course.courseCode}).`,
      type: 'enrollment',
      link: `/student/courses/${course._id}`
    });

    // Notify Faculty
    await sendNotification({
      recipientId: course.facultyId,
      senderId: req.user.id,
      title: 'New Student Enrolled',
      message: `${req.user.name} enrolled in your course "${course.title}".`,
      type: 'enrollment',
      link: `/faculty/courses/${course._id}`
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Drop course
// @route   POST /api/courses/:id/drop
// @access  Private (Student)
exports.dropCourse = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      courseId: req.params.id,
      studentId: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'You are not enrolled in this course' });
    }

    enrollment.status = 'dropped';
    await enrollment.save();

    res.json({
      success: true,
      message: 'Course dropped successfully',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrolled students roster for course
// @route   GET /api/courses/:id/students
// @access  Private (Faculty, Admin)
exports.getCourseStudents = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      courseId: req.params.id,
      status: 'active'
    }).populate('studentId', 'name email avatar studentId department');

    const studentIds = enrollments.map((e) => e.studentId._id);
    const performances = await Performance.find({
      courseId: req.params.id,
      studentId: { $in: studentIds }
    });

    const perfMap = {};
    performances.forEach((p) => {
      perfMap[p.studentId.toString()] = p;
    });

    const roster = enrollments.map((enr) => ({
      enrollmentId: enr._id,
      student: enr.studentId,
      enrolledAt: enr.enrolledAt,
      progressPercent: enr.progressPercent,
      finalGrade: enr.finalGrade,
      letterGrade: enr.letterGrade,
      performance: perfMap[enr.studentId._id.toString()] || null
    }));

    res.json({
      success: true,
      count: roster.length,
      students: roster
    });
  } catch (error) {
    next(error);
  }
};
