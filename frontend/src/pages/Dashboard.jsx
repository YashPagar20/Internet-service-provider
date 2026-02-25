import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import '../components/Layout.css';

const Dashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF';
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAdmin) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [isAdmin]);

    const fetchDashboardData = async () => {
        try {
            const data = await dashboardService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return <div className="dashboard-content">Loading...</div>;
    }

    return (
        <div className="dashboard-content fade-in">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p>Overview of your ISP performance</p>
            </div>

            {isAdmin ? (
                <>
                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <div className="stat-title">Total Customers</div>
                            <div className="stat-value">{stats?.totalCustomers || 0}</div>
                            <div className="stat-desc">From all regions</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">Active Plans</div>
                            <div className="stat-value">{stats?.activePlans || 0}</div>
                            <div className="stat-desc">Subscription options</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">Pending Bills</div>
                            <div className="stat-value">{stats?.pendingBills || 0}</div>
                            <div className="stat-desc">Need attention</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">Monthly Revenue</div>
                            <div className="stat-value">${stats?.monthlyRevenue?.toLocaleString() || '0'}</div>
                            <div className="stat-desc">Current month</div>
                        </div>
                    </div>

                    <div className="charts-container" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="chart-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h3>Revenue Trend</h3>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={stats?.revenueTrend || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="revenue" fill="#4f46e5" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="chart-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h3>Plan Distribution</h3>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={stats?.planDistribution || []}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats?.planDistribution?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
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
