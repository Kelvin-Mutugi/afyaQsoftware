// src/Login.jsx

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom"; // For page navigation
import { getDoc, setDoc, doc } from "firebase/firestore";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");       // Email input state
  const [password, setPassword] = useState(""); // Password input state
  const [error, setError] = useState("");       // Error message
  const navigate = useNavigate();               // Hook to navigate programmatically
  
  function LOG() {
    console.log("Login function called"); // Debugging log
  }
  
  LOG(); // Call the function to log the message
  
  // Handle login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // ✅ Redirect to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  
  // Handle login with Google account
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard"); // ✅ Redirect to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>AfyaQ Login</h2>

      {/* Login Form */}
      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>

        {/* Google Login */}
        <button type="button" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        {/* Error Display */}
        {error && <p>{error}</p>}
      </form>

      {/* Navigation to Signup */}
      <p style={{ textAlign: "center" }}>
        Don’t have an account? <a href="/signup">Sign up</a> 
        <a href="/Dashboard">move to dashboard</a>
      </p>
    </div>
  );
}
