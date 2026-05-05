import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import ProjectModal from '../components/ProjectModal';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, overdueTasks: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProjectData, setEditProjectData] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    // Data Fetch karne ka function
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // 1. Projects Fetch karo
            const { data: projectData } = await API.get('/projects');
            setProjects(projectData);

            // 2. Stats Fetch karo (Jo tune backend mein banaya tha)
            const { data: statsData } = await API.get('/tasks/stats');
            setStats(statsData);

            setLoading(false);
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            fetchDashboardData();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    const goToTasks = (projectId) => {
        navigate(`/tasks/${projectId}`);
    };
    const handleDeleteProject = async (projectId) => {
        if (window.confirm("Are you sure? This will delete the project and all its tasks!")) {
            try {
                await API.delete(`/projects/${projectId}`);
                fetchDashboardData(); // List refresh karo
            } catch (err) {
                alert("Delete failed");
            }
        }
    };
    if (loading) return <div className="loader">Loading Dashboard Data...</div>;

    return (
        <div className="dashboard-wrapper">
            {/* Navbar Section */}
            <nav className="dashboard-nav">
                <div className="logo">TaskMaster PRO</div>
                <div className="user-actions">
                    <div className="user-info">
                        <strong>{user.name}</strong>
                        <span>({user.role})</span>
                    </div>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </nav>

            <main className="dashboard-content">
                {/* 1. Stats Grid - Key Feature in Requirement */}
                <section className="stats-grid">
                    <div className="card">
                        <h3>Total Projects</h3>
                        <p>{projects.length}</p>
                    </div>
                    <div className="card success">
                        <h3>Completed Tasks</h3>
                        <p>{stats.completedTasks}</p>
                    </div>
                    <div className="card danger">
                        <h3>Overdue Tasks</h3>
                        <p>{stats.overdueTasks}</p>
                    </div>
                </section>

                {/* 2. Welcome Banner & Action Button */}
                <section className="welcome-banner">
                    <div>
                        <h1>Project Management</h1>
                        <p>Manage your teams and track progress efficiently.</p>
                    </div>
                    {user.role === 'Admin' && (
                        <button className="btn-primary" onClick={() => setShowModal(true)}>
                            + Create New Project
                        </button>
                    )}
                </section>

                {/* 3. Project List Grid */}
                <div className="project-list">
                    {projects.length > 0 ? (
                        projects.map((proj) => (
                            <div key={proj._id} className="project-card">
                                <div className="card-header">
                                    <h3>{proj.title}</h3>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <span className={`role-badge ${user.role}`}>Owner</span>
                                        {user.role === 'Admin' && (
                                            <div className="admin-project-actions">
                                                <button
                                                    onClick={() => {
                                                        setEditProjectData(proj); 
                                                        setShowModal(true);     
                                                    }}
                                                    className="action-btn-icon"
                                                >✏️</button>
                                                <button onClick={() => handleDeleteProject(proj._id)} className="action-btn-icon">🗑️</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p>{proj.description}</p>
                                <div className="card-footer">
                                    <div className="members-count">
                                        <strong>{proj.members?.length || 0}</strong> Members
                                    </div>
                                    <button
                                        className="btn-view"
                                        onClick={() => goToTasks(proj._id)}
                                    >
                                        View Tasks &rarr;
                                    </button>
                                </div>
                                
                            </div>
                        ))
                    ) : (
                        <div className="no-data">
                            <p>No projects found. {user.role === 'Admin' ? 'Start by creating your first project!' : 'Wait for an admin to add you.'}</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Project Creation & updation Modal (Admin Only) */}
            {showModal && (
                <ProjectModal
                    onClose={() => {
                        setShowModal(false);
                        setEditProjectData(null);
                    }}
                    onRefresh={fetchDashboardData}
                    projectData={editProjectData} 
                />
            )}
        </div>
    );
};

export default Dashboard;