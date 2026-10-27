const express = require('express');
const router = express.Router();
const { getUsers, getFacultyList, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/faculty-list', protect, getFacultyList);

// Admin-only endpoints
router.use(protect, authorize('admin'));
router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
