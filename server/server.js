
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth");
const habitRoutes = require("./routes/habits");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "HabitFlow API is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

// Serve the React frontend in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "..", "client", "dist");

  app.use(express.static(clientPath));

  app.get("/{*splat}", (req, res, next) => {
    res.sendFile(path.join(clientPath, "index.html"), (error) => {
      if (error) next(error);
    });
  });
}

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// General error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must contain at least 32 characters");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`HabitFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
