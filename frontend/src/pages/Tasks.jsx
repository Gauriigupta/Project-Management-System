import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editTaskData, setEditTaskData] = useState(null); // Edit ke liye state
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const fetchTasks = async () => {
        try {
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
            fetchTasks();
        } catch (err) { alert("Status update failed"); }
    };

    // --- OWNER/ADMIN ACTIONS ---

    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await API.delete(`/tasks/${taskId}`);
                fetchTasks(); // Refresh list
            } catch (err) {
                alert("Delete failed. Check if backend route exists.");
            }
        }
    };

    const handleEdit = (task) => {
        setEditTaskData(task); // Task data modal ko bhejo
        setShowTaskModal(true);
    };

    return (
        <div className="task-view-container">
            <header className="task-header">
                <h1>Project Tasks</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" onClick={() => navigate('/dashboard')}>&larr; Back</button>
                    {user.role === 'Admin' && (
                        <button className="btn-primary" onClick={() => {
                            setEditTaskData(null); // Naya task ke liye reset
                            setShowTaskModal(true);
                        }}>
                            + Assign Task
                        </button>
                    )}
                </div>
            </header>

            <div className="task-grid">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task._id} className={`task-card ${task.status.replace(' ', '-')}`}>
                            <div className="task-card-header">
                                <h3>{task.title}</h3>
                                {user.role === 'Admin' && (
                                    <div className="admin-actions">
                                        <button className="btn-edit-sm" onClick={() => handleEdit(task)}>✏️</button>
                                        <button className="btn-delete-sm" onClick={() => handleDelete(task._id)}>🗑️</button>
                                    </div>
                                )}
                            </div>

                            <p>{task.description}</p>

                            <div className="task-meta">
                                <select
                                    value={task.status}
                                    onChange={(e) => updateStatus(task._id, e.target.value)}
                                >
                                    <option value="To-do">To-do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data">No tasks assigned yet.</div>
                )}
            </div>

            {showTaskModal && (
                <TaskModal
                    projectId={projectId}
                    taskData={editTaskData} // Edit ke liye data pass karo
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