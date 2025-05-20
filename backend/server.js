const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to analyze symptoms
app.post("/analyze-symptoms", (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms are required." });
  }

  // Call the Python script
  exec(
    `python c:\\my-projects\\afyaQsoftware\\python-scripts\\run_model_locally.py "${symptoms}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: "Failed to analyze symptoms." });
      }
  
      // Log stderr but don't treat it as an error if it's non-critical
      if (stderr) {
        console.warn(`Stderr: ${stderr}`);
      }
  
      // Send the output back to the frontend
      try {
        const analysisResult = JSON.parse(stdout.trim());
        res.json(analysisResult);
      } catch (parseError) {
        console.error(`Parse Error: ${parseError.message}`);
        res.status(500).json({ error: "Failed to parse Python script output." });
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});