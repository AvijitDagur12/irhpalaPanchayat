import express from "express";
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
} from "../controllers/contactController.js";
import { upload } from "../middleware/upload.js";
import { verifyAdmin, requireRoles } from "../middleware/auth.js";

const router = express.Router();

// Citizen public grievance / message submission
router.post("/contact", upload.single("image"), submitContact);

// Grievance Handler Desk (protected: support, admin, bdo)
const grievanceRoles = requireRoles("support", "admin", "bdo");
router.get("/contacts", verifyAdmin, grievanceRoles, getAllContacts);
router.get("/contact/:id", verifyAdmin, grievanceRoles, getContactById);
router.put("/contact/:id", verifyAdmin, grievanceRoles, updateContactStatus);

export default router;
