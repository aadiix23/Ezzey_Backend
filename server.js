const express = require("express");
const app = express();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Example API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from API!" });
});

// Required for Render (use process.env.PORT)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
