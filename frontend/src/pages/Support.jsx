import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Support = () => {
    const { user, token } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', description: '' });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/tickets/customer/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:8080/api/tickets', {
                ...newTicket,
                customerId: user.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Support ticket raised successfully!");
            setNewTicket({ subject: '', description: '' });
            fetchTickets();
        } catch (error) {
            console.error("Error raising ticket:", error);
            toast.error("Failed to raise ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return '#3b82f6';
            case 'IN_PROGRESS': return '#f59e0b';
            case 'RESOLVED': return '#10b981';
            case 'CLOSED': return '#6b7280';
            default: return '#3b82f6';
        }
    };

    return (
        <div className="dashboard-content fade-in">
            <div className="page-header">
                <h1 className="page-title">Support & Help</h1>
                <p>Need assistance? Raise a ticket and our team will get back to you.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Raise Ticket Form */}
                <div className="stat-card" style={{ padding: '30px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Raise a New Ticket</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Subject</label>
                            <input
                                name="subject"
                                className="form-control"
                                placeholder="e.g., Internet not working"
                                value={newTicket.subject}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                style={{ minHeight: '120px' }}
                                placeholder="Describe your issue in detail..."
                                value={newTicket.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="logout-btn"
                            style={{
                                background: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                width: '100%',
                                padding: '12px',
                                opacity: submitting ? 0.7 : 1
                            }}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </form>
                </div>

                {/* My Tickets List */}
                <div className="stat-card" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>My Tickets</h3>
                    {loading ? (
                        <p>Loading tickets...</p>
                    ) : (
                        <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                            {tickets.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>No tickets raised yet.</p>
                            ) : (
                                tickets.map(ticket => (
                                    <div key={ticket.id} style={{
                                        padding: '15px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        marginBottom: '15px',
                                        borderLeft: `4px solid ${getStatusColor(ticket.status)}`
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ margin: 0 }}>{ticket.subject}</h4>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '2px 8px',
                                                background: getStatusColor(ticket.status),
                                                borderRadius: '50px',
                                                fontWeight: 'bold'
                                            }}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                            {ticket.description}
                                        </p>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                                            Raised on: {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Support;
