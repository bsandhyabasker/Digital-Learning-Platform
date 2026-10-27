const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  dropCourse,
  getCourseStudents
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getCourses);
router.get('/:id', protect, getCourseById);
router.get('/:id/students', protect, authorize('faculty', 'admin'), getCourseStudents);

router.post('/', protect, authorize('faculty', 'admin'), createCourse);
router.put('/:id', protect, authorize('faculty', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteCourse);

router.post('/:id/enroll', protect, authorize('student'), enrollInCourse);
router.post('/:id/drop', protect, authorize('student'), dropCourse);

module.exports = router;
