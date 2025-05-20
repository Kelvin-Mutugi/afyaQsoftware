import './App.css';
// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.js";
import Signup from "./Signup.js";
import Dashboard from "./Dashboard.js";
import ProtectedRoute from "./ProtectedRoute.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />

        {/* Protected general dashboard (if needed) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
