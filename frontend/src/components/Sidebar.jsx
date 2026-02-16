import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span>ISP AutoSystem</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    Dashboard
                </NavLink>

                {isAdmin ? (
                    <>
                        <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            Customers
                        </NavLink>
                        <NavLink to="/plans" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            Plans
                        </NavLink>
                        <NavLink to="/billing" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            Billing
                        </NavLink>
                        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            Analytics
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/my-bill" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            My Bill
                        </NavLink>
                        <NavLink to="/support" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            Support
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <p>&copy; 2026 ISP Inc.</p>
            </div>
        </aside>
    );
};

export default Sidebar;
