import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AdminEdit.css";

const AdminEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    role: "bdo",
    designation: "",
    department: "",
    isActive: true,
    password: "",
    confirmPassword: "",
  });
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!admin) {
      navigate("/admin");
      return;
    }
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/admin/${id}`);
        const a = res.data.admin;
        setOriginal(a);
        setForm({
          name: a.name || "",
          email: a.email || "",
          phone: a.phone || "",
          dob: a.dob || "",
          role: a.role === "member" || a.role === "elected_member" ? "member" : "bdo",
          designation: a.designation || "",
          department: a.department || "",
          isActive: a.isActive !== false,
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        setError(err.message || "Failed to load administrative account.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [id, admin, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        dob: form.dob,
        role: form.role,
        designation: form.designation,
        department: form.department,
        isActive: form.isActive,
      };
      if (form.password.trim()) {
        payload.password = form.password;
      }

      await api.put(`/api/admin/${id}`, payload);
      setSuccess("Administrative profile updated and saved to database successfully.");

      // Refresh in background
      const refreshed = await api.get(`/api/admin/${id}`);
      setOriginal(refreshed.data.admin);

      // Clear password fields after save
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to update administrative account.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-edit-page">
        <div className="table-loading">
          <div className="gov-spinner"></div>
          <p>Loading administrative account details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-edit-page">
      {/* Header */}
      <div className="admin-edit-header">
        <div className="header-left">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="State Emblem of India"
            className="govt-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://iconape.com/wp-content/files/bt/257232/svg/257232.svg";
            }}
          />
          <div className="header-title">
            <h1>Administrative Account Profile</h1>
            <p>
              {original ? `Managing: ${original.name} (${original.email})` : "Update official account"}
            </p>
          </div>
        </div>
        <div className="header-right">
          <Link
            to="/admin/manage-admins"
            className="gov-btn gov-btn-outline"
            style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}
          >
            ← Back to Directory
          </Link>
        </div>
      </div>

      {/* Form Card */}
      <form className="admin-edit-form" onSubmit={handleSubmit}>
        {error && <div className="gov-alert gov-alert-error">{error}</div>}
        {success && <div className="gov-alert gov-alert-success">{success}</div>}

        <div className="form-section">
          <h3>Official Identity & Role Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Official full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Official Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="officer@panchayat.gov.in"
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth / Age *</label>
              <input
                type="text"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                placeholder="e.g. 15-08-1982 or Age: 43"
              />
            </div>

            <div className="form-group">
              <label>Authorized Role *</label>
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="bdo">BDO Admin (Block Development Officer)</option>
                <option value="member">Panchayat Elected Member (Pradhan / Desk Member)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Official Designation</label>
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="e.g. Block Development Officer"
              />
            </div>

            <div className="form-group full-width">
              <label>Department / Office</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Panchayat & Rural Development"
              />
            </div>

            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                <span>Account is Active (permitted to authenticate)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Administrative Password Management</h3>
          <p className="hint">
            To change the administrative password, enter the new password below. It will be securely hashed with bcrypt. Leave blank to retain existing password.
          </p>
          <div className="form-grid">
            <div className="form-group">
              <label>New Administrative Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="gov-btn gov-btn-primary"
            disabled={saving}
            style={{ padding: "10px 24px" }}
          >
            {saving ? "Saving Changes..." : "💾 Save Changes to Database"}
          </button>
          <Link to="/admin/manage-admins" className="gov-btn gov-btn-outline" style={{ padding: "10px 20px" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminEdit;