import React from "react";
import "./App.css";
import Booking from "./pages/Booking";

function App() {
  return (
    <div className="App">
      <h1>Hospital Appointment Booking</h1>

      {/* Booking Page */}
      <Booking />
    </div>
  );
}

export default App;