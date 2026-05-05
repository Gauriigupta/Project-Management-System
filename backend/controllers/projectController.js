const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
    const { title, description, membersEmail } = req.body;
    try {
        const members = await User.find({ email: { $in: membersEmail } });
        const project = await Project.create({
            title,
            description,
            admin: req.user._id,
            members: members.map(m => m._id)
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const filter = req.user.role === 'Admin' ? { admin: req.user._id } : { members: req.user._id };
        const projects = await Project.find(filter).populate('members', 'name email').populate('admin', 'name');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // Sirf Admin delete kar sake
        await project.deleteOne();
        res.json({ message: "Project and its tasks deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Project Update karne ke liye (Title aur Description)
exports.updateProject = async (req, res) => {
    try {
        const { title, description, membersEmail } = req.body; 
        const project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ message: "Project not found" });

       
        project.title = title || project.title;
        project.description = description || project.description;

       
        if (membersEmail && membersEmail.length > 0) {
            const users = await User.find({ email: { $in: membersEmail } });
            const userIds = users.map(u => u._id);

            project.members = userIds;
        }

        await project.save();
        res.json({ message: "Project updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};