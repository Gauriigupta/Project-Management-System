const express = require('express');
const router = express.Router();
const { createProject, getProjects , deleteProject,updateProject} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');


router.route('/')
    .get(protect, getProjects)     
    .post(protect, admin, createProject); 
router.delete('/:id', protect, admin, deleteProject);
router.put('/:id', protect, admin, updateProject);
module.exports = router;