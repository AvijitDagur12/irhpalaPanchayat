// server/controllers/controlOfficerController.js
// Control Officer only: login, list admins, fetch one admin, update admin, upload photo.
// Every action here requires verifyControlOfficer middleware.

import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { signControlToken } from "../middleware/controlOfficerAuth.js";

/* ============================================================
   LOGIN
   POST /api/control/login
   ============================================================ */
export const controlLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(400).json({ error: "Invalid Control Officer credentials." });
    }

    if (admin.role !== "control_officer") {
      return res
        .status(403)
        .json({ error: "Access forbidden. Control Officer privileges required." });
    }

    if (!admin.isActive) {
      return res.status(403).json({ error: "Control Officer account is inactive." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Control Officer credentials." });
    }

    const token = signControlToken(admin);

    res.json({
      success: true,
      token,
      officer: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        designation: admin.designation,
        photo: admin.photo || "",
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   LIST ALL ADMINS
   GET /api/control/admins
   ============================================================ */
export const controlListAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find()
      .select("-password")
      .sort({ role: 1, name: 1 });

    res.json({ success: true, count: admins.length, admins });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET ONE ADMIN
   GET /api/control/admins/:id
   ============================================================ */
export const controlGetAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      return res.status(404).json({ error: "Administrative account not found." });
    }
    res.json({ success: true, admin });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   UPDATE ADMIN (fields + optional password + optional photo)
   PUT /api/control/admins/:id
   ============================================================ */
export const controlUpdateAdmin = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      dob,
      role,
      designation,
      department,
      isActive,
      password,
      photo,
    } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: "Administrative account not found." });
    }

    // Prevent Control Officer from demoting the last control_officer
    if (admin.role === "control_officer" && role && role !== "control_officer") {
      const otherControlCount = await Admin.countDocuments({
        role: "control_officer",
        _id: { $ne: admin._id },
      });
      if (otherControlCount === 0) {
        return res.status(400).json({
          error: "Cannot demote the last Control Officer. Promote another account first.",
        });
      }
    }

    if (name !== undefined) admin.name = name.trim();
    if (email !== undefined) admin.email = email.toLowerCase().trim();
    if (phone !== undefined) admin.phone = phone.trim();
    if (dob !== undefined) admin.dob = dob.trim();
    if (role !== undefined) admin.role = role;
    if (designation !== undefined) admin.designation = designation;
    if (department !== undefined) admin.department = department;
    if (isActive !== undefined) admin.isActive = isActive;
    if (photo !== undefined) admin.photo = photo;

    if (password && password.trim().length > 0) {
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
      }
      admin.password = await bcrypt.hash(password, 10);
    }

    const updated = await admin.save();

    res.json({
      success: true,
      message: "Administrative account updated successfully.",
      admin: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        dob: updated.dob,
        role: updated.role,
        designation: updated.designation,
        department: updated.department,
        photo: updated.photo || "",
        isActive: updated.isActive,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "An admin with this email already exists." });
    }
    next(err);
  }
};

/* ============================================================
   UPLOAD / REPLACE ADMIN PHOTO
   POST /api/control/admins/:id/photo
   (uses multer upload.single("photo") on the route)
   ============================================================ */
export const controlUploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No photo file uploaded." });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: "Administrative account not found." });
    }

    admin.photo = req.file.filename;
    await admin.save();

    res.json({
      success: true,
      message: "Administrative photo updated successfully.",
      photo: admin.photo,
    });
  } catch (err) {
    next(err);
  }
};