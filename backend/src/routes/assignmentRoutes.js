const express = require('express');
const router = express.Router();
const {
  getAssignmentsByCourse,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/course/:courseId', getAssignmentsByCourse);
router.get('/:id', getAssignmentById);

router.post('/', authorize('faculty', 'admin'), createAssignment);
router.put('/:id', authorize('faculty', 'admin'), updateAssignment);
router.delete('/:id', authorize('faculty', 'admin'), deleteAssignment);

module.exports = router;
