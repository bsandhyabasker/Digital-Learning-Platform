const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get all users (with filtering, pagination & search)
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, department, status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const count = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty members directory
// @route   GET /api/users/faculty-list
// @access  Private
exports.getFacultyList = async (req, res, next) => {
  try {
    const faculty = await User.find({ role: 'faculty', status: 'active' })
      .select('name email avatar department bio employeeId');

    res.json({
      success: true,
      count: faculty.length,
      faculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user by Admin
// @route   POST /api/users
// @access  Private (Admin)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, studentId, employeeId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already in use.' });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'Password@123',
      role: role || 'student',
      department: department || 'Computer Science',
      studentId,
      employeeId
    });

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details or role
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, department, status, studentId, employeeId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, department, status, studentId, employeeId },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / de-provision user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Clean up student enrollments or handle dependencies
    await Enrollment.deleteMany({ studentId: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
