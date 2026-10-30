import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET || "irhpala_panchayet_default_secret_fallback_key";

/**
 * Generate a signed JWT token
 */
export const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Middleware: Verify Citizen User JWT
 */
export const verifyCitizen = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Check if legacy userId is passed in body/query in dev mode for backward compatibility
      if (req.body?.userId || req.params?.userId) {
        const fallbackId = req.body?.userId || req.params?.userId;
        const user = await User.findById(fallbackId);
        if (user) {
          req.user = user;
          return next();
        }
      }
      return res.status(401).json({ error: "Access denied. No authentication token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id || decoded._id);
    if (!user) {
      return res.status(401).json({ error: "User no longer exists or session is invalid." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token. Please log in again." });
  }
};

/**
 * Middleware: Verify Admin / Official JWT
 */
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. Administrative authentication required." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if token belongs to an admin
    const admin = await Admin.findById(decoded.id || decoded._id);
    if (!admin) {
      return res.status(403).json({ error: "Access forbidden. Administrative privileges required." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired administrative token." });
  }
};

/**
 * Role-Based Access Control middleware generator
 */
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: "Authentication required." });
    }
    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        error: `Access forbidden. Required role: ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};
