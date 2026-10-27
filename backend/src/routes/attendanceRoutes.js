const express = require('express');
const router = express.Router();
const {
  getCourseAttendance,
  saveAttendanceSession,
  getMyAttendanceSummary
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my-summary', authorize('student'), getMyAttendanceSummary);
router.get('/course/:courseId', getCourseAttendance);
router.post('/session', authorize('faculty', 'admin'), saveAttendanceSession);

module.exports = router;
