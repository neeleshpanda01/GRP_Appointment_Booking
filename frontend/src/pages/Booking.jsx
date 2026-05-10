import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Booking({ user }) {
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    notes: ""
  });
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/doctor`);
      const data = await res.json();
      setDoctors(data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setMessage("error:Failed to load doctors");
    } finally {
      setDoctorsLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.date || !form.time) {
      setMessage("error:Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/appointment`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          ...form,
          userId: user._id
        })
      });

      const data = await res.json();
      if (data._id) {
        setMessage("success:Appointment booked successfully!");
        setForm({ doctorId: "", date: "", time: "", notes: "" });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("error:" + (data.msg || "Booking failed"));
      }
    } catch (err) {
      setMessage("error:Server error - please try again");
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find(d => d._id === form.doctorId);

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">📅 Book Appointment</h2>
        <p className="form-subtitle">Schedule an appointment with our healthcare professionals</p>
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
          <label className="form-label">Select Doctor *</label>
          <select
            className="form-select"
            value={form.doctorId}
            onChange={e => setForm({...form, doctorId: e.target.value})}
            disabled={loading || doctorsLoading}
          >
            <option value="">-- Choose a Doctor --</option>
            {doctors.map(d => (
              <option key={d._id} value={d._id}>
                {d.name} - {d.specialization}
                {!d.available ? " (Not Available)" : ""}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div style={{
            padding: "12px",
            background: "#f0f4ff",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "0.9rem"
          }}>
            <p><strong>Selected:</strong> {selectedDoctor.name}</p>
            <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
            {selectedDoctor.experience && <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Preferred Date *</label>
          <input
            type="date"
            className="form-input"
            value={form.date}
            onChange={e => setForm({...form, date: e.target.value})}
            min={getMinDate()}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Time *</label>
          <input
            type="time"
            className="form-input"
            value={form.time}
            onChange={e => setForm({...form, time: e.target.value})}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Additional Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Any medical conditions or concerns we should know about?"
            value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading || !form.doctorId}>
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
}