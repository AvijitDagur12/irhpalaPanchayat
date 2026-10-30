import express from "express";
import {
  adminLogin,
  getDashboardStats,
  getApplications,
  updateApplicationStatus,
  getCitizens,
  getAllAdmins,
  getAdminById,
  updateAdmin,
} from "../controllers/adminController.js";
import { verifyAdmin, requireRoles } from "../middleware/auth.js";

const router = express.Router();

// Admin Authentication
router.post("/login", adminLogin);

// Dashboard Statistics & Reports (protected)
router.get("/stats", verifyAdmin, getDashboardStats);

// Gram Panchayat Certificate Applications Management (Secretary, BDO, Admin)
const pscRoles = requireRoles("secretary", "bdo", "admin");
router.get("/applications", verifyAdmin, pscRoles, getApplications);
router.put("/application/:id", verifyAdmin, pscRoles, updateApplicationStatus);

// Registered Citizens Directory (protected)
router.get("/employees", verifyAdmin, getCitizens);
router.get("/citizens", verifyAdmin, getCitizens);

// ─────────────────────────────────────────────
// ADMIN MANAGEMENT (protected, role-restricted)
// Only BDO admin can access
// ─────────────────────────────────────────────
const adminRoles = requireRoles("bdo", "admin");

router.get("/all", verifyAdmin, adminRoles, getAllAdmins);
router.get("/:id", verifyAdmin, adminRoles, getAdminById);
router.put("/:id", verifyAdmin, adminRoles, updateAdmin);

export default router;