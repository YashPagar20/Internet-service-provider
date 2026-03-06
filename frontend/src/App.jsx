import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Plans from './pages/Plans.jsx'
import MyBill from './pages/MyBill.jsx'
import Support from './pages/Support.jsx'
import Layout from './components/Layout.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/my-bill" element={<MyBill />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
        </AuthProvider>
    )
}

export default App
