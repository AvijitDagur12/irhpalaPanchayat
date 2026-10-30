import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  uploadDocument,
  getUserDocuments,
  deleteDocument,
} from "../controllers/authController.js";
import { verifyCitizen } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Authentication
router.post("/register", upload.single("photo"), register);
router.post("/login", login);

// Profile
router.get("/profile", verifyCitizen, getProfile);
router.put("/update-profile", upload.single("photo"), updateProfile);
router.put("/update-password", updatePassword);

// Citizen Document Vault
router.post("/upload-document", upload.single("file"), uploadDocument);
router.get("/user-documents/:userId", getUserDocuments);
router.delete("/delete-document/:docId", deleteDocument);

export default router;
