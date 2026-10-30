// server/middleware/controlOfficerAuth.js
// Secure authentication middleware for the Control Officer role ONLY.
// Uses a dedicated JWT secret (CONTROL_JWT_SECRET) that is different from
// the normal admin/citizen JWT secret, so no admin token can ever be used here.

import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import Admin from "../models/Admin.js";

const CONTROL_JWT_SECRET =
  process.env.CONTROL_JWT_SECRET || "control_fallback_secret_change_me";

/**
 * Sign a short-lived Control Officer token (2h)
 */
export const signControlToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: "control_officer",
      name: admin.name,
      scope: "control",
    },
    CONTROL_JWT_SECRET,
    { expiresIn: "2h" }
  );
};

/**
 * Verify Control Officer JWT.
 * Only role === "control_officer" AND isActive === true can pass.
 */
export const verifyControlOfficer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Control Officer authentication required." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, CONTROL_JWT_SECRET);

    if (decoded.scope !== "control") {
      return res.status(403).json({ error: "Invalid token scope for Control Officer access." });
    }

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(403).json({ error: "Control Officer account no longer exists." });
    }
    if (admin.role !== "control_officer") {
      return res.status(403).json({ error: "Access forbidden. Control Officer privileges required." });
    }
    if (!admin.isActive) {
      return res.status(403).json({ error: "Control Officer account is inactive." });
    }

    req.controlOfficer = admin;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Control Officer session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid Control Officer token." });
  }
};

/**
 * Rate limiter for Control Officer login — 5 attempts per 15 minutes per IP.
 */
export const controlLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts from this IP. Please wait 15 minutes and try again.",
  },
});