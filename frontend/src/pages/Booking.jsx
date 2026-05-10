import { useState } from "react";

export default function Booking() {
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    userId: "1"
  });

  const submit = async () => {
    const res = await fetch("http://localhost:5000/api/appointment", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.msg || "Booked");
  };

  return (
    <div>
      <h2>Book Appointment</h2>

      <input placeholder="Doctor ID"
        onChange={e=>setForm({...form, doctorId:e.target.value})}/>

      <input type="date"
        onChange={e=>setForm({...form, date:e.target.value})}/>

      <input placeholder="Time"
        onChange={e=>setForm({...form, time:e.target.value})}/>

      <button onClick={submit}>Book</button>
    </div>
  );
}