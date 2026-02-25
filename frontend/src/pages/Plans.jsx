import React, { useState, useEffect } from 'react';
import { getPlans, createPlan, deletePlan } from '../services/planService';
import './Plans.css';

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newPlan, setNewPlan] = useState({
        planName: '',
        speedMbps: '',
        price: '',
        validityDays: '',
        description: '',
        isPopular: false
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
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setNewPlan({ ...newPlan, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPlan(newPlan);
            setShowForm(false);
            setNewPlan({
                planName: '',
                speedMbps: '',
                price: '',
                validityDays: '',
                description: '',
                isPopular: false
            });
            fetchPlans();
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
        <div className="plans-container">
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Internet Plans</h1>
                        <p>Special curated offers for you</p>
                    </div>
                    <button
                        className="logout-btn"
                        style={{ background: 'var(--primary-color)', color: 'white', border: 'none' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Add New Plan'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="plan-form-card">
                    <h3 style={{ marginBottom: '20px' }}>Create New Plan</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Plan Name</label>
                                <input name="planName" className="form-control" value={newPlan.planName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input name="price" type="number" className="form-control" value={newPlan.price} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Validity (Days)</label>
                                <input name="validityDays" type="number" className="form-control" value={newPlan.validityDays} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Speed (Mbps)</label>
                                <input name="speedMbps" type="number" className="form-control" value={newPlan.speedMbps} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description (Details like Data, Voice)</label>
                            <textarea name="description" className="form-control" style={{ minHeight: '80px' }} value={newPlan.description} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input name="isPopular" type="checkbox" id="isPopular" checked={newPlan.isPopular} onChange={handleInputChange} />
                            <label htmlFor="isPopular" style={{ margin: 0 }}>Mark as Popular</label>
                        </div>
                        <button type="submit" className="logout-btn" style={{ background: 'var(--primary-color)', color: 'white', border: 'none', width: '100%' }}>
                            Save Plan
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Curating the best plans for you...</p>
                </div>
            ) : (
                <div className="plans-grid">
                    {plans.map((plan) => {
                        // Simple logic to parse description into bullet points if it contains ":" or ","
                        const features = plan.description
                            ? plan.description.split(/[,:]/).filter(f => f.trim().length > 3).map(f => f.trim())
                            : [`Speed: ${plan.speedMbps} Mbps`, `Validity: ${plan.validityDays} days`];

                        return (
                            <div key={plan.id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
                                <div className="plan-header">
                                    <div className="plan-name-badge">{plan.planName}</div>
                                    <div className="plan-price-display">
                                        <span className="plan-currency-symbol">₹</span>
                                        <span className="plan-price-amount">{Math.floor(plan.price)}</span>
                                        <span className="plan-price-period">/ pack</span>
                                    </div>
                                </div>

                                <div className="speed-badge">
                                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                                    <div>
                                        <div className="speed-value">{plan.speedMbps} Mbps</div>
                                        <div className="speed-label">Max Speed</div>
                                    </div>
                                </div>

                                <div className="plan-features">
                                    <div className="feature-item">
                                        <span className="feature-icon">🗓️</span>
                                        <span><b>Validity:</b> {plan.validityDays > 0 ? `${plan.validityDays} Days` : 'Existing Validity'}</span>
                                    </div>
                                    {features.map((feature, idx) => (
                                        <div key={idx} className="feature-item">
                                            <span className="feature-icon">✓</span>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="plan-card-footer">
                                    <button className="buy-btn" onClick={() => alert(`Subscribing to ${plan.planName}...`)}>
                                        Select Plan
                                    </button>
                                    <div className="delete-icon-btn" onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}>
                                        🗑️
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {plans.length === 0 && (
                        <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '60px', background: 'var(--card-bg)', borderRadius: '24px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📡</div>
                            <h3 style={{ color: 'var(--text-primary)' }}>No Plans Available</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>We'll be back with exciting offers soon!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Plans;
