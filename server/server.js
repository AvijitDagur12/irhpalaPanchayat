import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import controlOfficerRoutes from "./routes/controlOfficerRoutes.js";
import { seedDefaultAdmins } from "./controllers/adminController.js";

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://irhpala-panchayat-client.vercel.app",
  "https://irhpala-panchayat-client-4mkv17ya3.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: origin not allowed"), false);
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static file hosting for uploaded citizen documents and photographs
app.use(
  "/uploads",
  express.static(uploadDir, {
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

// Root Service Status Route
app.get("/", (req, res) => {
  res.json({
    status: "active",
    service: "Irhpala Gram Panchayat Digital Services API",
    version: "2.0.0",
    jurisdiction: "Paschim Medinipur, Ghatal, West Bengal",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", uptime: process.uptime() });
});

// Mount modular API routes
app.use("/api", authRoutes);
app.use("/api", applicationRoutes);
app.use("/api", certificateRoutes);
app.use("/api", contactRoutes);
app.use("/api", controlOfficerRoutes); // Control Officer endpoints (/api/control/*)
app.use("/api/admin", adminRoutes);
app.use("/api", adminRoutes); // Backward compatibility

// Global Error Handler
app.use(errorHandler);

// Database Connection & Server Initialization
connectDB()
  .then(async () => {
    // Seed default administrative roles securely if needed
    await seedDefaultAdmins();

    app.listen(PORT, () => {
      console.log(`🏛️ Irhpala Digital Panchayat Server listening on port ${PORT} ✅`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to database error:", err);
  });

export default app;