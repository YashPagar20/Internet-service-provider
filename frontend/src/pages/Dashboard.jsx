import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css'; // Ensure we have the styles

const Dashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF';

    return (
        <div className="dashboard-content fade-in">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p>Overview of your ISP performance</p>
            </div>

            {isAdmin ? (
                <div className="dashboard-grid">
                    <div className="stat-card">
                        <div className="stat-title">Total Customers</div>
                        <div className="stat-value">1,245</div>
                        <div className="stat-desc">+3.2% from last month</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Active Plans</div>
                        <div className="stat-value">8</div>
                        <div className="stat-desc">Standard, Premium, Gold</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Pending Bills</div>
                        <div className="stat-value">42</div>
                        <div className="stat-desc">Need attention</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Monthly Revenue</div>
                        <div className="stat-value">$12,450</div>
                        <div className="stat-desc">+8.5% growth</div>
                    </div>
                </div>
            ) : (
                <div className="dashboard-grid">
                    <div className="stat-card">
                        <div className="stat-title">Current Plan</div>
                        <div className="stat-value">Gold 100Mbps</div>
                        <div className="stat-desc">Active</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Amount Due</div>
                        <div className="stat-value">$0.00</div>
                        <div className="stat-desc">No pending bills</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
