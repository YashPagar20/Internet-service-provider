import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<div><h1>ISP Automation System</h1><p>Welcome to the ISP Automation System</p></div>} />
                <Route path="/login" element={<div><h1>Login Page</h1></div>} />
            </Routes>
        </div>
    )
}

export default App
