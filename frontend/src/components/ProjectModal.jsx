import React, { useState, useEffect } from 'react';
import API from '../api';

const ProjectModal = ({ onClose, onRefresh, projectData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        membersEmail: ''
    });

    useEffect(() => {
        if (projectData) {
            setFormData({
                title: projectData.title || '',
                description: projectData.description || '',
                // Purane members ke emails comma se separate karke dikhao
                membersEmail: projectData.members?.map(m => m.email).join(', ') || ''
            });
        } else {
            setFormData({ title: '', description: '', membersEmail: '' });
        }
    }, [projectData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Emails ko array mein convert karo (Space trim karke)
            const emailsArray = formData.membersEmail
                ? formData.membersEmail.split(',').map(email => email.trim()).filter(e => e !== "")
                : [];

            if (projectData) {
                // UPDATE: Title, Desc aur Members sab bhejo
                await API.put(`/projects/${projectData._id}`, {
                    ...formData,
                    membersEmail: emailsArray
                });
            } else {
                // CREATE: Naya project
                await API.post('/projects', {
                    ...formData,
                    membersEmail: emailsArray
                });
            }
            onRefresh();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{projectData ? "Edit Project & Team" : "Create New Project"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Project Title</label>
                    <input
                        type="text" value={formData.title} required
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    <label>Description</label>
                    <textarea
                        value={formData.description} required
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <label>Manage Members (Emails separated by comma)</label>
                    <input
                        type="text"
                        placeholder="user1@test.com, user2@test.com"
                        value={formData.membersEmail}
                        onChange={(e) => setFormData({ ...formData, membersEmail: e.target.value })}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#667', marginTop: '-10px' }}>
                        * Adding an email will add them, removing an email will remove them from project.
                    </p>

                    <div className="modal-btns">
                        <button type="submit" className="save-btn">
                            {projectData ? "Update Project" : "Create Project"}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;