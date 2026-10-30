import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Document from "../models/Document.js";
import { generateToken } from "../middleware/auth.js";
import fs from "fs";
import path from "path";

/**
 * Register a new citizen
 * POST /api/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, village, password } = req.body;

    if (!name || !email || !phone || !village || !password) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // Check if email already in use
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "An account with this email address already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const photoFilename = req.file ? req.file.filename : null;

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      village: village.trim(),
      password: hashedPassword,
      photo: photoFilename,
    });

    await user.save();

    const token = generateToken({ id: user._id, role: "citizen" });

    res.status(201).json({
      message: "Citizen account registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        village: user.village,
        photo: user.photo,
        role: "citizen",
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Citizen Login
 * POST /api/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials or account does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password. Please try again." });
    }

    const token = generateToken({ id: user._id, role: "citizen" });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        village: user.village,
        photo: user.photo,
        role: "citizen",
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current logged in citizen profile
 * GET /api/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Citizen profile not found." });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Update citizen profile
 * PUT /api/update-profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const targetUserId = req.user?._id || req.body.userId;
    const { name, phone, village } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (village) updateData.village = village.trim();
    if (req.file) updateData.photo = req.file.filename;

    const user = await User.findByIdAndUpdate(targetUserId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        village: user.village,
        photo: user.photo,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update password
 * PUT /api/update-password
 */
export const updatePassword = async (req, res, next) => {
  try {
    const targetUserId = req.user?._id || req.body.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both current and new passwords are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long." });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
};

/**
 * Document management
 */
export const uploadDocument = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Please select a document file to upload." });
    }

    const doc = new Document({
      userId,
      name: name || req.file.originalname,
      file: req.file.filename,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    });

    await doc.save();
    res.status(201).json({ message: "Document uploaded successfully", document: doc });
  } catch (err) {
    next(err);
  }
};

export const getUserDocuments = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.params.userId;
    const docs = await Document.find({ userId }).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const { docId } = req.params;
    const doc = await Document.findById(docId);
    if (!doc) {
      return res.status(404).json({ error: "Document not found." });
    }

    // Try deleting physical file if exists
    const filePath = path.join(process.cwd(), "uploads", doc.file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn("Could not remove file:", e.message);
      }
    }

    await Document.findByIdAndDelete(docId);
    res.json({ message: "Document deleted successfully." });
  } catch (err) {
    next(err);
  }
};
