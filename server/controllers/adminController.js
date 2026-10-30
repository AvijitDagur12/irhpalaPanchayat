import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import Application from "../models/Application.js";
import Certificate from "../models/Certificate.js";
import Contact from "../models/Contact.js";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

/**
 * Admin Login
 * POST /api/admin/login
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter your administrative email and password." });
    }

    let admin = await Admin.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { name: email.trim() }],
    });

    if (!admin) {
      return res.status(400).json({ error: "Invalid administrative credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password." });
    }

    if (!admin.isActive) {
      return res.status(403).json({ error: "This administrative account is inactive. Contact the Control Officer." });
    }

    const token = generateToken({
      id: admin._id,
      role: admin.role,
      name: admin.name,
      designation: admin.designation,
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        designation: admin.designation,
        department: admin.department,
        photo: admin.photo || "",
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Comprehensive Dashboard Statistics
 * GET /api/admin/stats
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalCitizens,
      totalCertificates,
      totalContacts,
      pendingContacts,
    ] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: "Pending" }),
      Application.countDocuments({ status: "Approved" }),
      Application.countDocuments({ status: "Rejected" }),
      User.countDocuments(),
      Certificate.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: "pending" }),
    ]);

    const recentApps = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("applicantName certificateType status village appliedDate createdAt");

    const recentActivities = recentApps.map((app) => ({
      id: app._id,
      action: `${app.certificateType} Application (${app.status})`,
      time: new Date(app.appliedDate || app.createdAt).toLocaleDateString("en-IN"),
      user: app.applicantName,
      village: app.village,
    }));

    res.json({
      success: true,
      stats: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalCitizens,
        totalCertificates,
        totalContacts,
        pendingContacts,
        reportsCount: totalApplications + totalContacts,
      },
      reports: {
        certificatesIssued: approvedApplications,
        meetingsHeld: 12,
        complaintsResolved: totalContacts - pendingContacts,
        schemesLaunched: 8,
        beneficiaries: Math.max(totalCitizens, 120),
        fundsUtilized: "₹18,75,000",
      },
      recentActivities,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all citizen applications with search and filter
 * GET /api/admin/applications
 */
export const getApplications = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = new RegExp(`^${status}$`, "i");
    }

    if (search) {
      query.$or = [
        { applicantName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { applicationNumber: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await Application.find(query)
      .populate("userId", "name email phone photo village")
      .sort({ appliedDate: -1, createdAt: -1 });

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/**
 * Update application status
 * PUT /api/admin/application/:id
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const existing = await Application.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (existing.status === "Approved") {
      return res.status(400).json({
        error: "Approved applications are permanent and immutable. Status cannot be modified.",
      });
    }

    existing.status = status;
    existing.remarks = remarks !== undefined ? remarks : existing.remarks;
    existing.approvedBy =
      req.admin?.name ||
      (req.admin?.role === "secretary" ? "Gram Panchayat Secretary" : "Panchayat Administrative Officer");

    if (status === "Approved") {
      existing.approvedDate = new Date();
    }

    const application = await existing.save();

    res.json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all registered citizens / employees
 * GET /api/admin/employees
 */
export const getCitizens = async (req, res, next) => {
  try {
    const citizens = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(citizens);
  } catch (err) {
    next(err);
  }
};

/**
 * Ensure default administrative roles exist
 */
export const seedDefaultAdmins = async () => {
  try {
    const defaultAccounts = [
      {
        email: "admin@panchayat.gov.in",
        name: "BDO Administrative Officer",
        passwordRaw: "admin@123",
        role: "bdo",
        designation: "Block Development Officer",
      },
      {
        email: "user@irhpala.in",
        name: "Panchayat Elected Member",
        passwordRaw: "irhpala@2026",
        role: "member",
        designation: "Panchayat Executive Pradhan",
      },
      {
        email: "secretary@panchayat.gov.in",
        name: "Panchayat Secretary",
        passwordRaw: "secretary@123",
        role: "secretary",
        designation: "Gram Panchayat Secretary",
      },
      {
        email: "support@panchayat.gov.in",
        name: "Public Grievance Officer",
        passwordRaw: "support@123",
        role: "support",
        designation: "Grievance Redressal Officer",
      },
    ];

    // Control Officer — credentials from .env only, never hardcoded
    if (process.env.CONTROL_EMAIL && process.env.CONTROL_PASSWORD) {
      defaultAccounts.push({
        email: process.env.CONTROL_EMAIL,
        name: "System Control Officer",
        passwordRaw: process.env.CONTROL_PASSWORD,
        role: "control_officer",
        designation: "System Control Officer",
      });
    } else {
      console.warn("⚠️ CONTROL_EMAIL / CONTROL_PASSWORD not set in .env — Control Officer not seeded.");
    }

    for (const acc of defaultAccounts) {
      let admin = await Admin.findOne({ email: acc.email });
      if (!admin) {
        const hashedPassword = await bcrypt.hash(acc.passwordRaw, 10);
        await Admin.create({
          name: acc.name,
          email: acc.email,
          password: hashedPassword,
          role: acc.role,
          designation: acc.designation,
        });
        console.log(`🛡️ Provisioned admin role: ${acc.email} (${acc.role})`);
      } else {
        // Synchronize canonical roles for primary portals
        if (acc.email === "admin@panchayat.gov.in" && (admin.role !== "bdo" || admin.name.includes("Super"))) {
          admin.role = "bdo";
          admin.name = "BDO Administrative Officer";
          await admin.save();
        } else if (acc.email === "user@irhpala.in" && admin.role !== "member") {
          admin.role = "member";
          admin.name = "Panchayat Elected Member";
          await admin.save();
        } else if (acc.role === "control_officer" && admin.role !== "control_officer") {
          // Promote to control_officer if role drifted
          admin.role = "control_officer";
          await admin.save();
        }
      }
    }
  } catch (e) {
    console.error("Could not seed default admins:", e.message);
  }
};

/* ============================================================
   ADMIN MANAGEMENT (READ + UPDATE)
   ============================================================ */

/**
 * Get all admins (READ - list)
 * GET /api/admin/all
 */
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: admins.length, admins });
  } catch (err) {
    next(err);
  }
};

/**
 * Get one admin by ID (READ - single)
 * GET /api/admin/:id
 */
export const getAdminById = async (req, res, next) => {
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

/**
 * Update admin details (UPDATE)
 * PUT /api/admin/:id
 */
export const updateAdmin = async (req, res, next) => {
  try {
    const { name, email, role, designation, department, phone, dob, isActive, password, photo } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: "Administrative account not found." });
    }

    if (name !== undefined) admin.name = name.trim();
    if (email !== undefined) admin.email = email.toLowerCase().trim();
    if (role !== undefined) admin.role = role;
    if (designation !== undefined) admin.designation = designation;
    if (department !== undefined) admin.department = department;
    if (phone !== undefined) admin.phone = phone.trim();
    if (dob !== undefined) admin.dob = dob.trim();
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
        role: updated.role,
        designation: updated.designation,
        department: updated.department,
        phone: updated.phone,
        dob: updated.dob,
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