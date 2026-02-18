import React, { useState, useEffect } from 'react';
import { getPlans, createPlan, deletePlan } from '../services/planService';
import '../components/Layout.css'; // Reusing layout styles

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newPlan, setNewPlan] = useState({
        planName: '',
        speed: '',
        price: '',
        dataLimit: ''
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await getPlans();
            setPlans(data);
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPlan(newPlan);
            setShowForm(false);
            setNewPlan({ planName: '', speed: '', price: '', dataLimit: '' });
            fetchPlans(); // Refresh list
            alert('Plan created successfully!');
        } catch (error) {
            console.error("Error creating plan:", error);
            alert('Failed to create plan.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                await deletePlan(id);
                fetchPlans();
            } catch (error) {
                console.error("Error deleting plan:", error);
                alert('Failed to delete plan.');
            }
        }
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Internet Plans</h1>
                        <p>Manage subscription plans</p>
                    </div>
                    <button
                        className="login-btn"
                        style={{ width: 'auto', padding: '10px 20px' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Create New Plan'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="stat-card" style={{ marginBottom: '30px', maxWidth: '600px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Add New Plan</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Plan Name</label>
                            <input
                                type="text"
                                name="planName"
                                className="form-control"
                                value={newPlan.planName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Speed (Mbps)</label>
                            <input
                                type="number"
                                name="speed"
                                className="form-control"
                                value={newPlan.speed}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                className="form-control"
                                value={newPlan.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Limit (GB)</label>
                            <input
                                type="text"
                                name="dataLimit"
                                className="form-control"
                                value={newPlan.dataLimit}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="login-btn">Save Plan</button>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading plans...</p>
            ) : (
                <div className="dashboard-grid">
                    {plans.map((plan) => (
                        <div key={plan.id} className="stat-card">
                            <div className="stat-title">{plan.speed} Mbps</div>
                            <div className="stat-value">{plan.planName}</div>
                            <div className="stat-desc" style={{ fontSize: '1.2rem', color: '#4f46e5' }}>
                                ${plan.price} / month
                            </div>
                            <p style={{ marginTop: '10px', color: '#64748b' }}>
                                Data Limit: {plan.dataLimit}
                            </p>
                            <button
                                onClick={() => handleDelete(plan.id)}
                                style={{
                                    marginTop: '15px',
                                    background: '#fee2e2',
                                    color: '#ef4444',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {plans.length === 0 && <p>No plans found. Create one!</p>}
                </div>
            )}
        </div>
    );
};

export default Plans;
