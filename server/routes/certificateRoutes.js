import express from "express";
import {
  createCertificate,
  getCertificateByTicket,
  getAllCertificates,
  updateCertificateStatus,
  downloadCertificatePdf,
} from "../controllers/certificateController.js";

import { verifyAdmin, requireRoles } from "../middleware/auth.js";

const router = express.Router();

// Direct certificate application & tracking (citizen facing)
router.post("/certificate", createCertificate);
router.get("/certificate/ticket/:ticketId", getCertificateByTicket);

// Elected Member Certificate Desk (restricted to member / elected_member)
const memberRoles = requireRoles("member", "elected_member", "admin");

router.get("/certificates", verifyAdmin, memberRoles, getAllCertificates);
router.put("/certificate/:id", verifyAdmin, memberRoles, updateCertificateStatus);

// Bengali/English PDF download
router.get("/download-certificate-pdf/:id", downloadCertificatePdf);

export default router;
