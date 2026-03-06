import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MyBill = () => {
    const { user, token } = useAuth();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/bills/customer/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBills(response.data);
        } catch (error) {
            console.error("Error fetching bills:", error);
            toast.error("Failed to fetch bills.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = async (billId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/bills/${billId}/download`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${billId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download receipt.");
        }
    };

    const openPaymentModal = (bill) => {
        setSelectedBill(bill);
        setShowPaymentModal(true);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setPaymentProcessing(true);
        try {
            // Simulated delay for "processing"
            await new Promise(resolve => setTimeout(resolve, 2000));

            await axios.post('http://localhost:8080/api/payments', {
                billId: selectedBill.id,
                amount: selectedBill.amount,
                paymentMethod: 'CREDIT_CARD',
                customerId: user.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Payment Successful!");
            setShowPaymentModal(false);
            fetchBills();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Payment failed. Please try again.");
        } finally {
            setPaymentProcessing(false);
        }
    };

    return (
        <div className="dashboard-content fade-in">
            <div className="page-header">
                <h1 className="page-title">My Billing</h1>
                <p>Manage your subscriptions and download receipts.</p>
            </div>

            <div className="stat-card" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Billing History</h3>
                {loading ? (
                    <p>Loading bills...</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '15px' }}>Date</th>
                                <th style={{ padding: '15px' }}>Amount</th>
                                <th style={{ padding: '15px' }}>Status</th>
                                <th style={{ padding: '15px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No bills found.</td></tr>
                            ) : (
                                bills.map(bill => (
                                    <tr key={bill.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px' }}>{new Date(bill.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px' }}>₹{bill.amount}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '50px',
                                                fontSize: '0.8rem',
                                                background: bill.status === 'PAID' ? '#10b981' : '#ef4444'
                                            }}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            {bill.status === 'UNPAID' ? (
                                                <button
                                                    onClick={() => openPaymentModal(bill)}
                                                    className="buy-btn"
                                                    style={{ padding: '5px 15px', fontSize: '0.85rem' }}
                                                >
                                                    Pay Now
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleDownloadReceipt(bill.id)}
                                                    className="buy-btn"
                                                    style={{ padding: '5px 15px', fontSize: '0.85rem', background: '#3b82f6' }}
                                                >
                                                    Receipt 📄
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mock Payment Gateway Modal */}
            {showPaymentModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000, backdropFilter: 'blur(5px)'
                }}>
                    <div className="stat-card" style={{ width: '400px', padding: '30px', position: 'relative' }}>
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
                        >✕</button>

                        <h2 style={{ marginBottom: '10px' }}>Secure Payment</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Paying: <b>₹{selectedBill?.amount}</b></p>

                        <form onSubmit={handlePayment}>
                            <div className="form-group">
                                <label>Card Number</label>
                                <input className="form-control" placeholder="xxxx xxxx xxxx xxxx" required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Expiry</label>
                                    <input className="form-control" placeholder="MM/YY" required />
                                </div>
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input className="form-control" placeholder="***" type="password" required />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="logout-btn"
                                style={{
                                    width: '100%', background: 'var(--primary-color)', color: 'white', border: 'none', padding: '12px', marginTop: '10px',
                                    opacity: paymentProcessing ? 0.7 : 1
                                }}
                                disabled={paymentProcessing}
                            >
                                {paymentProcessing ? 'Processing...' : 'Complete Payment'}
                            </button>
                            <p style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: '15px', color: 'var(--text-secondary)' }}>
                                🔒 Secure 256-bit SSL Encrypted Connection
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBill;
