const express = require('express');
const router = express.Router();
const {
    createTask,
    updateTaskStatus,
    getDashboardStats, 
    getTasksByProject,
    deleteTask, updateTask
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/:projectId', protect, getTasksByProject);
router.post('/', protect, admin, createTask);
router.patch('/:id/status', protect, updateTaskStatus);
router.put('/:id', protect, admin, updateTask);
router.delete('/:id', protect, admin, deleteTask);

module.exports = router;