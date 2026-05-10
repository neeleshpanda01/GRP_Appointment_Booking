import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setMessage("error:Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setMessage("success:Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage("error:" + (data.msg || "Login failed"));
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
        <h2 className="form-title">🔐 Welcome Back</h2>
        <p className="form-subtitle">Login to your healthcare account</p>
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
            placeholder="Enter your password"
            value={form.password}
            onChange={e=>setForm({...form,password:e.target.value})}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{textAlign: "center", marginTop: "24px"}}>
        <p style={{color: "#718096"}}>
          New user?{" "}
          <a href="/register" style={{color: "var(--primary)", fontWeight: "600"}}>
            Create account here
          </a>
        </p>
      </div>

      <div style={{marginTop: "20px", padding: "16px", background: "#f0f4ff", borderRadius: "8px", textAlign: "center"}}>
        <p style={{fontSize: "0.85rem", color: "#718096", marginBottom: "8px"}}>Demo Credentials:</p>
        <p style={{fontSize: "0.85rem", color: "var(--primary)", fontFamily: "monospace"}}>
          admin@test.com / password
        </p>
      </div>
    </div>
  );
}