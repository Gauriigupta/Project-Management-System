const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
    const { title, description, project, assignedToEmail, dueDate } = req.body;
    try {
        const user = await User.findOne({ email: assignedToEmail });
        if (!user) return res.status(404).json({ message: "User not found" });

        const task = await Task.create({ title, description, project, assignedTo: user._id, dueDate });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.status = req.body.status || task.status;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// @desc    Get dashboard stats (Total, Pending, Overdue)
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        let query = {};

        if (req.user.role === 'Admin') {
            
            const adminProjects = await Project.find({ owner: userId }).select('_id');
            const projectIds = adminProjects.map(p => p._id);

    
            query.project = { $in: projectIds };
        } else {
            
            query.assignedTo = userId;
        }

        const totalTasks = await Task.countDocuments(query);

        const completedTasks = await Task.countDocuments({
            ...query,
            status: 'Completed'
        });

        const overdueTasks = await Task.countDocuments({
            ...query,
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() }
        });

        res.json({ totalTasks, completedTasks, overdueTasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Task Delete karne ke liye
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Check karo ki delete karne wala Admin hi hai
        await task.deleteOne();
        res.json({ message: "Task removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateTask = async (req, res) => {
    try {
        const { assignedToEmail, ...otherData } = req.body;
        let updateData = { ...otherData };

        if (assignedToEmail) {
            const user = await User.findOne({ email: assignedToEmail });
            if (!user) return res.status(404).json({ message: "Researcher not found" });
            const updatedTask = await Task.findByIdAndUpdate(
                req.params.id,
                {
                    ...updateData,
                    $addToSet: { assignedTo: user._id }
                },
                { new: true }
            ).populate('assignedTo', 'name email');

            return res.json(updatedTask);
        }
        const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('assignedTo', 'name email');
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};