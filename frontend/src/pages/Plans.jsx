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
                <div style={{ textAlign: 'center', padding: '50px' }}>Loading plans...</div>
            ) : (
                <div className="plans-list">
                    {plans.map((plan) => (
                        <div key={plan.id} className="plan-row" onClick={() => console.log('Plan selected:', plan.id)}>
                            <div className="plan-price-section">
                                <span className="plan-currency">₹</span>
                                <span className="plan-price">{plan.price}</span>
                            </div>

                            <div className="plan-info-section">
                                <div className="plan-validity">Validity: {plan.validityDays > 0 ? `${plan.validityDays} days` : 'Existing Plan'}</div>
                                <div className="plan-details">
                                    {plan.description || `Plan - MRP ${plan.price} , Speed: ${plan.speedMbps} Mbps`}
                                </div>
                                {plan.isPopular && (
                                    <div className="plan-tag">
                                        <svg className="plan-tag-icon" viewBox="0 0 24 24">
                                            <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 8.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                                        </svg>
                                        Popular
                                    </div>
                                )}
                            </div>

                            <div className="plan-action-section">
                                <span style={{ marginRight: '15px' }} onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}>
                                    🗑️
                                </span>
                                <span>❯</span>
                            </div>
                        </div>
                    ))}
                    {plans.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            No subscription plans found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Plans;
