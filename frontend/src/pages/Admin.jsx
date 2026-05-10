import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Admin() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [addDoctorForm, setAddDoctorForm] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    experience: 0,
    available: true
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/doctor/appointments`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log("Appointments:", data);
      setAppointments(data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const addDoctor = async (e) => {
    e.preventDefault();
    if (!addDoctorForm.name || !addDoctorForm.specialization) {
      setMessage("error:Doctor name and specialization are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/doctor`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(addDoctorForm)
      });

      const data = await res.json();
      if (data._id) {
        setMessage("success:Doctor added successfully!");
        setAddDoctorForm({
          name: "",
          specialization: "",
          email: "",
          phone: "",
          experience: 0,
          available: true
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("error:" + (data.msg || "Failed to add doctor"));
      }
    } catch (err) {
      setMessage("error:Server error");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await fetch(`${API_URL}/api/appointment/cancel/${id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"}
      });

      const data = await res.json();
      setMessage("success:Appointment cancelled");
      fetchAppointments();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("error:Failed to cancel appointment");
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">🛡️ Admin Panel</h2>
        <p className="page-subtitle">Manage doctors and view all appointments</p>
      </div>

      {message && (
        <div className={`message message-${message.split(":")[0]}`} style={{marginBottom: "20px"}}>
          <span style={{fontSize: "1.2rem"}}>
            {message.split(":")[0] === "success" ? "✅" : "❌"}
          </span>
          <span>{message.split(":")[1]}</span>
        </div>
      )}

      <div className="admin-container">
        {/* Add Doctor Section */}
        <div className="admin-section">
          <h3 className="admin-section-title">➕ Add New Doctor</h3>
          <form onSubmit={addDoctor}>
            <div className="form-group">
              <label className="form-label">Doctor Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Dr. John Smith"
                value={addDoctorForm.name}
                onChange={e => setAddDoctorForm({...addDoctorForm, name: e.target.value})}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Cardiology"
                value={addDoctorForm.specialization}
                onChange={e => setAddDoctorForm({...addDoctorForm, specialization: e.target.value})}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="doctor@example.com"
                value={addDoctorForm.email}
                onChange={e => setAddDoctorForm({...addDoctorForm, email: e.target.value})}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (555) 123-4567"
                value={addDoctorForm.phone}
                onChange={e => setAddDoctorForm({...addDoctorForm, phone: e.target.value})}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience (years)</label>
              <input
                type="number"
                className="form-input"
                value={addDoctorForm.experience}
                onChange={e => setAddDoctorForm({...addDoctorForm, experience: parseInt(e.target.value)})}
                disabled={loading}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={addDoctorForm.available}
                  onChange={e => setAddDoctorForm({...addDoctorForm, available: e.target.checked})}
                  disabled={loading}
                />
                <span>Available</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Doctor"}
            </button>
          </form>
        </div>

        {/* Appointments Section */}
        <div className="admin-section">
          <h3 className="admin-section-title">📋 All Appointments</h3>
          {error && (
            <div className="message message-error" style={{marginBottom: "16px"}}>
              <span>⚠️</span>
              <span>Error: {error}</span>
            </div>
          )}

          {appointmentsLoading ? (
            <div style={{textAlign: "center", padding: "40px"}}>
              <div className="spinner" style={{margin: "0 auto", marginBottom: "16px"}}></div>
              <p>Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state" style={{padding: "40px 20px"}}>
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No Appointments</h3>
              <p className="empty-description">No appointments scheduled yet.</p>
            </div>
          ) : (
            <div style={{overflowY: "auto", maxHeight: "600px"}}>
              {appointments.map(a => (
                <div key={a._id} style={{
                  padding: "12px",
                  borderBottom: "1px solid #e2e8f0",
                  marginBottom: "12px"
                }}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px"}}>
                    <div style={{flex: 1}}>
                      <p style={{fontWeight: "600", marginBottom: "4px"}}>
                        Doctor ID: {typeof a.doctorId === 'object' ? a.doctorId.name : a.doctorId}
                      </p>
                      <p style={{fontSize: "0.9rem", color: "#718096", marginBottom: "4px"}}>
                        📅 {new Date(a.date).toLocaleDateString()} at {a.time}
                      </p>
                      <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
                        <span className={`card-badge ${
                          a.status === "booked" ? "badge-booked" :
                          a.status === "completed" ? "badge-available" :
                          "badge-unavailable"
                        }`}>
                          {a.status}
                        </span>
                        {a.status === "booked" && (
                          <button
                            onClick={() => cancelAppointment(a._id)}
                            className="btn btn-danger btn-small"
                            style={{padding: "4px 12px", fontSize: "0.85rem"}}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}