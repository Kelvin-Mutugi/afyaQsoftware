import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./patient.css";

const Dashboard = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [isCheckInOpen, setIsCheckInOpen] = useState(true);
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [triageText, setTriageText] = useState("");
  const [triageResponse, setTriageResponse] = useState(null);
  const [triageLoading, setTriageLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState([]); // Store all analysis results
  const [highestAnalysis, setHighestAnalysis] = useState(null); // Store highest result
  const [conditionPointsMap, setConditionPointsMap] = useState({}); // Map label to points

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    phone: "",
    symptoms: "",
  });

  // Helper to calculate age from DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      alert("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Assign condition points based on label and score
  const getConditionPoints = (label, score) => {
    const percentage = score * 100;
    if (label === "severe") {
      if (percentage >= 90) return 15;
      if (percentage <= 89) return 10;
    } else if (label === "moderate") {
      if (percentage >= 90) return 8;
      if (percentage <= 89) return 6;
    } else if (label === "mild") {
      if (percentage >= 90) return 5;
      if (percentage <= 89) return 3;
    }
    return 0;
  };

  // Check-in submit function
  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dob || !formData.phone || !formData.symptoms) {
      alert("Please fill in all fields.");
      return;
    }
    setCheckInLoading(true);

    try {
      const age = calculateAge(formData.dob);

      const response = await fetch("http://localhost:8000/analyze-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: formData.symptoms,
          age: age,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze symptoms.");
      }

      const data = await response.json();
      if (!data || !data.analysis || data.analysis.length === 0) {
        alert("No analysis data available.");
        return;
      }

      // Store all analysis results and assign condition points
      const pointsMap = {};
      const results = data.analysis.map((item) => {
        const percentage = (item.score * 100).toFixed(2);
        const points = getConditionPoints(item.label, item.score);
        pointsMap[item.label] = points;
        return {
          ...item,
          percentage,
          points,
        };
      });
      setAnalysisResults(results);
      setConditionPointsMap(pointsMap);

      // Find and store the highest result
      const highest = results.reduce((max, item) => (item.score > max.score ? item : max), { label: "", score: 0 });
      setHighestAnalysis({
        category: highest.label,
        percentage: highest.percentage,
        points: highest.points,
      });

    } catch (error) {
      console.error(error);
      alert("Error analyzing symptoms.");
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleTriageSubmit = async () => {
    if (!triageText.trim()) {
      alert("Please describe your symptoms.");
      return;
    }

    setTriageLoading(true);
    setTriageResponse(null);

    try {
      const response = await fetch("http://localhost:8000/analyze-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: triageText }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze symptoms.");
      }

      const data = await response.json();
      if (data && data.analysis) {
        setTriageResponse(data.analysis);
      } else {
        alert("Error analyzing symptoms.");
      }
    } catch (error) {
      alert("Error analyzing symptoms.");
    } finally {
      setTriageLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="top-bar">
        <h2>Hello, Joe</h2>
        <p className="quote">"Your health is your wealth. Take care today!"</p>
        <button className="logout-button" onClick={handleLogout} disabled={loading}>
          {loading ? "Logging out..." : "Log Out"}
        </button>
      </div>

      {/* Check-In Modal */}
      {isCheckInOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Patient Details</h3>
            <form onSubmit={handleCheckInSubmit}>
              <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
              <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              <textarea name="symptoms" placeholder="Describe your symptoms..." value={formData.symptoms} onChange={handleChange} required></textarea>
              <button type="submit" className="submit-button" disabled={checkInLoading}>
                {checkInLoading ? "Processing..." : "Check In"}
              </button>
              <button type="button" className="cancel-button" onClick={() => setIsCheckInOpen(false)}>Clear</button>
            </form>

            {/* Display All Analysis Results */}
            {analysisResults.length > 0 && (
              <div className="analysis-result" style={{ marginTop: "15px", background: "#f2f2f2", padding: "10px", borderRadius: "6px" }}>
                <strong>AI Assessment:</strong>
                <ul>
                  {analysisResults.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.label}:</strong> {item.percentage}% &nbsp;
                      <span style={{ color: "#888" }}>(Points: {item.points})</span>
                    </li>
                  ))}
                </ul>
                {/* Highlight the highest */}
                {highestAnalysis && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Most Likely Condition:</strong> {highestAnalysis.category} ({highestAnalysis.percentage}%, Points: {highestAnalysis.points})
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Triage Modal */}
      {isTriageOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>AI Triage Assistant</h3>
            <textarea
              placeholder="Enter your symptoms..."
              value={triageText}
              onChange={(e) => setTriageText(e.target.value)}
              rows={4}
              style={{ width: "100%", marginBottom: "10px" }}
            ></textarea>
            <button className="submit-button" onClick={handleTriageSubmit} disabled={triageLoading}>
              {triageLoading ? "Analyzing..." : "Get Assessment"}
            </button>
            <button className="cancel-button" onClick={() => setIsTriageOpen(false)}>Close</button>

            {triageResponse && (
              <div className="triage-response" style={{ marginTop: "15px", background: "#f2f2f2", padding: "10px", borderRadius: "6px" }}>
                <strong>AI Assessment:</strong>
                <ul>
                  {triageResponse.map((item, index) => (
                    <li key={index}>
                      <strong>{item.label}:</strong> {(item.score * 100).toFixed(2)}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;