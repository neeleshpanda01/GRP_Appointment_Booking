import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    myAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user?.role]);

  const fetchStats = async () => {
    try {
      const [doctorsRes, appointmentsRes] = await Promise.all([
        fetch(`${API_URL}/api/doctor`),
        fetch(`${API_URL}/api/appointment`)
      ]);

      const doctors = await doctorsRes.json();
      const appointments = await appointmentsRes.json();

      const myAppointments = appointments.filter(a => a.userId === user._id).length;

      setStats({
        totalDoctors: doctors.length,
        totalAppointments: appointments.length,
        myAppointments
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">Welcome, {user?.name}! 👋</h2>
        <p className="page-subtitle">Here's an overview of your healthcare system</p>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="spinner" style={{margin: "0 auto", marginBottom: "20px"}}></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <div className="card-grid" style={{gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"}}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">👨‍⚕️ Doctors</div>
              </div>
            </div>
            <div className="card-content">
              <div style={{fontSize: "2.5rem", fontWeight: "700", color: "var(--primary)", marginBottom: "10px"}}>
                {stats.totalDoctors}
              </div>
              <p className="card-subtitle">Available healthcare professionals</p>
            </div>
            <a href="/doctors" className="btn btn-secondary btn-small" style={{marginTop: "10px"}}>
              View Doctors →
            </a>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">📅 My Appointments</div>
              </div>
            </div>
            <div className="card-content">
              <div style={{fontSize: "2.5rem", fontWeight: "700", color: "var(--success)", marginBottom: "10px"}}>
                {stats.myAppointments}
              </div>
              <p className="card-subtitle">Your scheduled appointments</p>
            </div>
            <a href="/booking" className="btn btn-secondary btn-small" style={{marginTop: "10px"}}>
              Book Appointment →
            </a>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">📊 Total Appointments</div>
              </div>
            </div>
            <div className="card-content">
              <div style={{fontSize: "2.5rem", fontWeight: "700", color: "var(--warning)", marginBottom: "10px"}}>
                {stats.totalAppointments}
              </div>
              <p className="card-subtitle">System-wide appointments</p>
            </div>
          </div>
        </div>
      )}

      <div style={{marginTop: "40px", textAlign: "center"}}>
        <p style={{color: "white", fontSize: "1rem"}}>
          📞 Need help? Contact us at support@healthcare.com
        </p>
      </div>
    </div>
  );
}
