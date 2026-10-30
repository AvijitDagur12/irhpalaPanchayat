import express from "express";
import {
  apply,
  getUserApplications,
  getApplicationById,
  downloadCertificate,
} from "../controllers/applicationController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Apply for certificate with attachments
router.post(
  "/apply",
  upload.fields([
    { name: "doc1File", maxCount: 1 },
    { name: "doc2File", maxCount: 1 },
    { name: "gsCertificate", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  apply
);

// Get citizen applications
router.get("/my-applications/:userId", getUserApplications);
router.get("/application/:id", getApplicationById);

// Official PDF download
router.get("/download-certificate/:applicationId", downloadCertificate);

export default router;
