// src/Signup.jsx

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom"; // For redirection after signup
import "./auth.css";

export default function Signup() {
  const [email, setEmail] = useState("");       // Email input state
  const [password, setPassword] = useState(""); // Password input state
  const [error, setError] = useState("");       // Error message

  const navigate = useNavigate();               // Hook to redirect user

  // Handle signup with Firebase
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // ✅ Redirect to dashboard after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create an AfyaQ Account</h2>

      <form onSubmit={handleSignup}>
        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />

        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        <button type="submit">Sign Up</button>

        {error && <p>{error}</p>}
      </form>

      {/* Link to login page */}
      <p style={{ textAlign: "center" }}>
        Already have an account? <a href="/">Login</a>
        <a href="/Dashboard">move to dashboard</a>
      </p>
    </div>
  );
}
