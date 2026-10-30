// server/routes/controlOfficerRoutes.js
// All routes are under /api/control/*
// Login is rate-limited; everything else requires a valid Control Officer token.

import express from "express";
import {
  controlLogin,
  controlListAdmins,
  controlGetAdmin,
  controlUpdateAdmin,
  controlUploadPhoto,
} from "../controllers/controlOfficerController.js";
import {
  verifyControlOfficer,
  controlLoginLimiter,
} from "../middleware/controlOfficerAuth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/* ----- Public (rate-limited) ----- */
router.post("/control/login", controlLoginLimiter, controlLogin);

/* ----- Protected: Control Officer only ----- */
router.get("/control/admins", verifyControlOfficer, controlListAdmins);
router.get("/control/admins/:id", verifyControlOfficer, controlGetAdmin);
router.put("/control/admins/:id", verifyControlOfficer, controlUpdateAdmin);
router.post(
  "/control/admins/:id/photo",
  verifyControlOfficer,
  upload.single("photo"),
  controlUploadPhoto
);

export default router;