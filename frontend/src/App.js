import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Doctors from "./pages/Doctors";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {user && <Navbar user={user} logout={logout} />}
        <main className="main-content">
          <Routes>
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/doctors" element={user ? <Doctors /> : <Navigate to="/login" />} />
            <Route path="/booking" element={user ? <Booking user={user} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Navbar({ user, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">🏥</span>
          <span>HealthCare</span>
        </div>
        <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <a href="/" className="nav-link">Dashboard</a>
          <a href="/doctors" className="nav-link">Doctors</a>
          <a href="/booking" className="nav-link">Book Appointment</a>
          {user?.role === "admin" && (
            <a href="/admin" className="nav-link admin-link">Admin Panel</a>
          )}
        </div>
        <div className="nav-right">
          <span className="user-badge">
            <span className="badge-icon">👤</span>
            {user?.name}
          </span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default App;