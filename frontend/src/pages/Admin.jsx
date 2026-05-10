import { useEffect, useState } from "react";

export default function Admin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/doctor/appointments")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h2>All Appointments</h2>
      {data.map(a => (
        <div key={a._id}>
          {a.doctorId} - {a.date} - {a.time}
        </div>
      ))}
    </div>
  );
}