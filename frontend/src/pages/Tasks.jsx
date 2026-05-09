import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editTaskData, setEditTaskData] = useState(null);
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const fetchTasks = async () => {
        try {
            // Backend se tasks fetch karte waqt 'assignedTo' populate hona chahiye
            const { data } = await API.get(`/tasks/${projectId}`);
            setTasks(data);
        } catch (err) {
            console.error("Task fetch error", err);
        }
    };

    useEffect(() => {
        if (!user) navigate('/');
        fetchTasks();
    }, [projectId]);

    const updateStatus = async (taskId, newStatus) => {
        try {
            await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
            fetchTasks(); // Refresh list to show updated status colors
        } catch (err) {
            alert("Status update failed");
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await API.delete(`/tasks/${taskId}`);
                fetchTasks();
            } catch (err) {
                alert("Delete failed.");
            }
        }
    };

    const handleEdit = (task) => {
        setEditTaskData(task);
        setShowTaskModal(true);
    };

    return (
        <div className="task-view-container">
            <header className="task-header">
                <div className="header-left">
                    <h1>Project Workspace</h1>
                    <p>Track researcher contributions and task milestones.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => navigate('/dashboard')}>&larr; Dashboard</button>
                    {user.role === 'Admin' && (
                        <button className="btn-primary" onClick={() => {
                            setEditTaskData(null);
                            setShowTaskModal(true);
                        }}>
                            + New Assignment
                        </button>
                    )}
                </div>
            </header>

            <div className="task-grid">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task._id} className={`task-card ${task.status.replace(/\s+/g, '-')}`}>
                            <div className="task-card-header">
                                <div className="title-section">
                                    <h3>{task.title}</h3>
                                    <div className="assigned-info">
                                        <span className="user-icon">👥</span>
                                        Assigned to:
                                        <div className="members-list">
                                            {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 ? (
                                                task.assignedTo.map((member, index) => (
                                                    <span key={member._id || index} className="member-name-tag">
                                                        {member.name}{index < task.assignedTo.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))
                                            ) : (
                                                // Fallback agar single object aa jaye galti se
                                                task.assignedTo?.name ? (
                                                    <span className="member-name-tag">{task.assignedTo.name}</span>
                                                ) : (
                                                    <strong>Unassigned</strong>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {user.role === 'Admin' && (
                                    <div className="admin-actions">
                                        <button className="btn-icon" onClick={() => handleEdit(task)} title="Edit">✏️</button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(task._id)} title="Delete">🗑️</button>
                                    </div>
                                )}
                            </div>

                            <p className="task-description">{task.description}</p>

                            <div className="task-footer">
                                <div className="status-box">
                                    <label>Progress</label>
                                    <select
                                        value={task.status}
                                        onChange={(e) => updateStatus(task._id, e.target.value)}
                                        className={`status-dropdown ${task.status.replace(/\s+/g, '-')}`}
                                    >
                                        <option value="To-do">To-do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div className="due-info">
                                    <span className="due-label">Deadline</span>
                                    <span className="due-date">{new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-tasks">
                        <p>No active assignments found for this workspace.</p>
                    </div>
                )}
            </div>

            {showTaskModal && (
                <TaskModal
                    projectId={projectId}
                    taskData={editTaskData}
                    onClose={() => {
                        setShowTaskModal(false);
                        setEditTaskData(null);
                    }}
                    onRefresh={fetchTasks}
                />
            )}
        </div>
    );
};

export default Tasks;