import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLogin.css";

/**
 * Reusable department-specific admin login.
 *
 * Props:
 *  - deptTitle       : string  e.g. "Elected Member Certificate Desk"
 *  - deptBengali     : string
 *  - deptIcon        : string  emoji
 *  - accent          : string  hex color
 *  - allowedRoles    : array   e.g. ["member", "elected_member"]
 *  - redirectPath    : string  e.g. "/admin/certificates"
 *  - placeholderEmail: string
 */
const DepartmentLogin = ({
  deptTitle,
  deptBengali,
  deptIcon,
  accent = "#0f3b6c",
  allowedRoles,
  redirectPath,
  placeholderEmail,
}) => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(email, password);

      if (!res.success) {
        setError(res.error || "Authentication failed. Please verify credentials.");
        return;
      }

      // Role check — block wrong department
      const role = res.admin?.role;
      if (!allowedRoles.includes(role)) {
        setError(
          `Access denied. This desk requires ${allowedRoles
            .map((r) => r.toUpperCase())
            .join(" or ")} privileges. Your role: ${role?.toUpperCase()}.`
        );
        return;
      }

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Unexpected server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-portal-wrapper">
      <header className="admin-portal-header">
        <div className="admin-portal-header-container">
          <div className="portal-header-brand">
            <img
              src="https://iconape.com/wp-content/files/bt/257232/svg/257232.svg"
              alt="Emblem"
              className="portal-header-emblem"
            />
            <div>
              <h1>{deptIcon} {deptTitle}</h1>
              <p>{deptBengali} • Irhpala Gram Panchayat</p>
            </div>
          </div>
          <div>
            <Link
              to="/admin"
              className="gov-btn gov-btn-outline"
              style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)" }}
            >
              ← Department Hub
            </Link>
          </div>
        </div>
      </header>

      <main className="admin-portal-main" style={{ paddingTop: "40px" }}>
        <div
          className="portal-signin-card"
          style={{ maxWidth: "480px", margin: "0 auto", borderTop: `4px solid ${accent}` }}
        >
          <div className="signin-header">
            <span className="signin-icon">🔐</span>
            <h3>{deptTitle} Sign-In</h3>
            <p>Only authorized {allowedRoles.map((r) => r.toUpperCase()).join(" / ")} may enter</p>
          </div>

          {error && (
            <div className="gov-alert gov-alert-error" style={{ marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="gov-form">
            <div className="gov-form-group">
              <label>Official Email ID / Username *</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholderEmail || "official@panchayat.gov.in"}
                required
              />
            </div>

            <div className="gov-form-group">
              <label>Administrative Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter official password"
                required
              />
            </div>

            <button
              type="submit"
              className="gov-btn gov-btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "12px", marginTop: "10px", background: accent, borderColor: accent }}
            >
              {loading ? "Authenticating..." : `Sign In to ${deptTitle} →`}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link to="/admin" style={{ color: "#0f3b6c", fontSize: "0.85rem" }}>
              ← Return to Department Selection Hub
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DepartmentLogin;