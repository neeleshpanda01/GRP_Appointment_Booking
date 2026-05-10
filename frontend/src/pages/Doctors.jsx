import { useEffect, useState } from "react";

export default function Doctors() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/doctor")
      .then(res => res.json())
      .then(data => setDocs(data));
  }, []);

  return (
    <div>
      <h2>Doctors</h2>
      {docs.map(d => (
        <div key={d._id}>
          {d.name} - {d.specialization}
        </div>
      ))}
    </div>
  );
}