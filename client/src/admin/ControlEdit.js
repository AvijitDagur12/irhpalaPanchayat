// client/src/admin/ControlEdit.js
// Control Officer edit page — update any admin's details, password, and photo.
// Email & DOB are immutable (set once at creation).

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { getAssetUrl } from "../services/api";
import "./ControlOfficer.css";

const ROLE_OPTIONS = [
  { value: "bdo", label: "BDO Admin (Block Development Officer)" },
  { value: "member", label: "Elected Member (Pradhan)" },
  { value: "elected_member", label: "Elected Member (Legacy)" },
  { value: "admin", label: "System Admin" },
  { value: "secretary", label: "Panchayat Secretary" },
  { value: "support", label: "Grievance Officer" },
  { value: "control_officer", label: "Control Officer" },
];

const ControlEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem("control_token");

  useEffect(() => {
    if (!token) {
      navigate("/control-officer", { replace: true });
      return;
    }

    const fetchAdmin = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/control/admins/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const a = res.data.admin;
        setOriginal(a);
        setForm({
          name: a.name || "",
          email: a.email || "",
          phone: a.phone || "",
          dob: a.dob || "",
          role: a.role || "bdo",
          designation: a.designation || "",
          department: a.department || "",
          isActive: a.isActive !== false,
          password: "",
          confirmPassword: "",
        });
        setPhotoPreview(a.photo ? getAssetUrl(a.photo) : "");
      } catch (err) {
        if (err.message?.toLowerCase().includes("expired")) {
          localStorage.removeItem("control_token");
          localStorage.removeItem("control_officer");
          navigate("/control-officer", { replace: true });
          return;
        }
        setError(err.message || "Failed to load administrative account.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5MB.");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    try {
      setUploadingPhoto(true);
      setError("");
      const fd = new FormData();
      fd.append("photo", photoFile);
      const res = await api.post(`/api/control/admins/${id}/photo`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data?.success) {
        setSuccess("Photo uploaded successfully.");
        setOriginal((prev) => ({ ...prev, photo: res.data.photo }));
        setPhotoFile(null);
      }
    } catch (err) {
      setError(err.message || "Failed to upload photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (showPasswordSection && form.password) {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name,
        phone: form.phone,
        role: form.role,
        designation: form.designation,
        department: form.department,
        isActive: form.isActive,
        // email, dob intentionally excluded — immutable
      };
      if (showPasswordSection && form.password.trim()) {
        payload.password = form.password;
      }

      const res = await api.put(`/api/control/admins/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setSuccess("Administrative profile updated successfully.");
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        setShowPasswordSection(false);
        setOriginal(res.data.admin);
      }
    } catch (err) {
      setError(err.message || "Failed to update administrative account.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="control-edit-page">
        <div className="control-loading">
          <div className="gov-spinner"></div>
          <p>Loading account details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="control-edit-page">
      <header className="control-edit-header">
        <div className="header-left">
          <span className="control-nav-icon">🔐</span>
          <div>
            <h1>Edit Administrative Account</h1>
            <p>
              {original
                ? `Managing: ${original.name} (${original.email})`
                : "Update official account"}
            </p>
          </div>
        </div>
        <Link to="/control-officer/dashboard" className="gov-btn gov-btn-outline">
          ← Back to Directory
        </Link>
      </header>

      <div className="control-edit-container">
        <div className="control-edit-photo-section">
          <div className="control-photo-preview">
            {photoPreview ? (
              <img src={photoPreview} alt="Admin" />
            ) : (
              <div className="control-photo-placeholder">👤</div>
            )}
          </div>
          <div className="control-photo-actions">
            <label className="gov-btn gov-btn-outline control-photo-btn">
              {photoFile ? "Change Selected Photo" : "Choose Photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                hidden
              />
            </label>
            {photoFile && (
              <button
                type="button"
                className="gov-btn gov-btn-primary"
                onClick={handleUploadPhoto}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? "Uploading..." : "Upload Photo"}
              </button>
            )}
            <small>Max 5MB. JPEG / PNG / WEBP.</small>
          </div>
        </div>

        <form className="control-edit-form" onSubmit={handleSubmit}>
          {error && <div className="gov-alert gov-alert-error">{error}</div>}
          {success && <div className="gov-alert gov-alert-success">{success}</div>}

          <div className="form-section">
            <h3>Identity & Role</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Official Email * <span className="readonly-badge">Read-only</span></label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  readOnly
                  className="readonly-input"
                  title="Email cannot be changed"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth / Age <span className="readonly-badge">Read-only</span></label>
                <input
                  type="text"
                  name="dob"
                  value={form.dob}
                  readOnly
                  className="readonly-input"
                  title="Date of birth cannot be changed"
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select name="role" value={form.role} onChange={handleChange} required>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group full-width">
                <label>Department / Office</label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section security-section">
            <h3>Security & Access</h3>

            <div className="security-toggle-row">
              <div className="security-info">
                <strong>Account Status</strong>
                <p>
                  {form.isActive
                    ? "Account is Active — this administrator can log in."
                    : "Account is Disabled — this administrator cannot log in."}
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="security-toggle-row">
              <div className="security-info">
                <strong>Administrative Password</strong>
                <p>Change this account's login password. Leave unchanged to keep current password.</p>
              </div>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => {
                  setShowPasswordSection((s) => !s);
                  setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
                }}
              >
                {showPasswordSection ? "Cancel Password Change" : "Change Password"}
              </button>
            </div>

            {showPasswordSection && (
              <div className="password-change-box">
                <div className="form-grid">
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="input-with-eye">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="input-with-eye">
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowConfirm((s) => !s)}
                      >
                        {showConfirm ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                </div>
                <small className="hint">
                  ⚠️ Changing this password will immediately require the user to log in with the new credentials.
                </small>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="gov-btn gov-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
            <Link to="/control-officer/dashboard" className="gov-btn gov-btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ControlEdit;