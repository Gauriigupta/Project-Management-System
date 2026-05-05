import React, { useState } from 'react';
import API from '../api';

const TaskModal = ({ projectId, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        title: '', description: '', assignedToEmail: '', dueDate: ''
    });

    // TaskModal.jsx mein handleSubmit ke andar console laga kar check karo
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending Data:", { ...formData, project: projectId }); 
        try {
            await API.post('/tasks', { ...formData, project: projectId });
            onRefresh();
            onClose();
        } catch (err) {
            // Error alert ko thoda detail mein dikhao
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Assign New Task</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Task Title" required
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    <textarea placeholder="Task Description" required
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    <input type="email" placeholder="Member's Email" required
                        onChange={(e) => setFormData({ ...formData, assignedToEmail: e.target.value })} />
                    <input type="date" required
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                    <div className="modal-btns">
                        <button type="submit" className="save-btn">Assign Task</button>
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;