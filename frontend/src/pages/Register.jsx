import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Register({ setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Valid email is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setMessage(`error:${error}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();
      if (data._id) {
        setMessage("success:Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("error:" + (data.msg || "Registration failed"));
      }
    } catch (err) {
      setMessage("error:Server error - please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">📝 Create Account</h2>
        <p className="form-subtitle">Join our healthcare platform today</p>
      </div>

      {message && (
        <div className={`message message-${message.split(":")[0]}`}>
          <span style={{fontSize: "1.2rem"}}>
            {message.split(":")[0] === "success" ? "✅" : "❌"}
          </span>
          <span>{message.split(":")[1]}</span>
        </div>
      )}

      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text"
            className="form-input"
            placeholder="John Doe"
            value={form.name}
            onChange={e=>setForm({...form,name:e.target.value})}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email"
            className="form-input"
            placeholder="john@example.com"
            value={form.email}
            onChange={e=>setForm({...form,email:e.target.value})}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password"
            className="form-input"
            placeholder="Enter a strong password"
            value={form.password}
            onChange={e=>setForm({...form,password:e.target.value})}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input 
            type="password"
            className="form-input"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={e=>setForm({...form,confirmPassword:e.target.value})}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div style={{textAlign: "center", marginTop: "24px"}}>
        <p style={{color: "#718096"}}>
          Already have an account?{" "}
          <a href="/login" style={{color: "var(--primary)", fontWeight: "600"}}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}