import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Doctors() {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/doctor`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log("Doctors:", data);
      setDocs(data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">👨‍⚕️ Our Doctors</h2>
        <p className="page-subtitle">Select a healthcare professional to book an appointment</p>
      </div>

      {error && (
        <div className="message message-error">
          <span>⚠️</span>
          <span>Error: {error}</span>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <div className="spinner" style={{margin: "0 auto", marginBottom: "20px"}}></div>
          <p>Loading doctors...</p>
        </div>
      ) : docs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👨‍⚕️</div>
          <h3 className="empty-title">No Doctors Available</h3>
          <p className="empty-description">There are currently no doctors in the system.</p>
          <p className="empty-description">Contact administrator to add doctors.</p>
        </div>
      ) : (
        <div className="card-grid">
          {docs.map(d => (
            <div key={d._id} className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{d.name}</h3>
                  <p className="card-subtitle">{d.specialization}</p>
                </div>
              </div>

              <div className="card-content">
                {d.experience && (
                  <div className="card-row">
                    <span className="card-label">Experience:</span>
                    <span className="card-value">{d.experience} years</span>
                  </div>
                )}
                {d.phone && (
                  <div className="card-row">
                    <span className="card-label">Contact:</span>
                    <span className="card-value">{d.phone}</span>
                  </div>
                )}
                {d.rating !== undefined && (
                  <div className="card-row">
                    <span className="card-label">Rating:</span>
                    <span className="card-value">⭐ {d.rating.toFixed(1)}</span>
                  </div>
                )}
                <div className="card-row">
                  <span className="card-label">Availability:</span>
                  <span className={`card-badge ${d.available ? "badge-available" : "badge-unavailable"}`}>
                    {d.available ? "✅ Available" : "❌ Not Available"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/booking")}
                className="btn btn-primary btn-small"
                style={{marginTop: "16px", width: "100%"}}
                disabled={!d.available}
              >
                {d.available ? "Book Appointment 📅" : "Not Available"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}