import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async () => {
    await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(form)
    });
    alert("Registered");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
      <button onClick={submit}>Register</button>
    </div>
  );
  const temp = 1;
}