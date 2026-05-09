import React, { useState, useEffect } from 'react';
import API from '../api';

const TaskModal = ({ projectId, onClose, onRefresh, taskData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedToEmail: '',
        dueDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. UPDATE LOGIC: Agar edit button daba hai to taskData ko form mein load karein
    useEffect(() => {
        if (taskData) {
            setFormData({
                title: taskData.title || '',
                description: taskData.description || '',
                assignedToEmail: taskData.assignedTo?.email || '', // Email ko properly pick karein
                dueDate: taskData.dueDate ? taskData.dueDate.split('T')[0] : '' // Date format fix
            });
        }
    }, [taskData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (taskData) {
                
                await API.put(`/tasks/${taskData._id}`, formData);
            } else {// CREATE MODE: POST request with projectId
                await API.post('/tasks', { ...formData, project: projectId });
            }
            onRefresh();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    {/* Header change based on mode */}
                    <h2>{taskData ? 'Update Task' : 'Assign New Task'}</h2>
                    <p>Setting milestones for AI data operations.</p>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Title</label>
                        <input
                            type="text"
                            placeholder="e.g., RLHF Evaluation"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Task Description</label>
                        <textarea
                            placeholder="Details of LLM post-training workflow..."
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Member's Email</label>
                        <input
                            type="email"
                            placeholder="researcher@ethara.ai"
                            required
                            value={formData.assignedToEmail}
                            onChange={(e) => setFormData({ ...formData, assignedToEmail: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Deadline</label>
                        <input
                            type="date"
                            required
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>

                    <div className="modal-btns">
                        <button type="submit" className="save-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : taskData ? 'Update Task' : 'Assign Task'}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn" disabled={isSubmitting}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;