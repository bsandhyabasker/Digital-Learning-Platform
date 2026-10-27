const express = require('express');
const router = express.Router();
const {
  getStudentAnalytics,
  getFacultyAnalytics,
  getAdminAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/student', authorize('student'), getStudentAnalytics);
router.get('/faculty', authorize('faculty'), getFacultyAnalytics);
router.get('/admin', authorize('admin'), getAdminAnalytics);

module.exports = router;
