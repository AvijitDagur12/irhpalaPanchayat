import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./PSC.css";

const PSC = () => {
  const navigate = useNavigate();
  const { admin, loginAdmin, logoutAdmin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const villageStats = {
    totalVillages: 12,
    totalPopulation: "8,240+",
    totalHouseholds: "1,620+",
    totalSchemes: 15,
    activeSchemes: 12,
    pendingApplications: 8,
    approvedApplications: 156,
    totalEmployees: 14,
    fundsUtilized: "₹24,50,000",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        setUsername("");
        setPassword("");
      } else {
        setLoginError(res.error || "Authentication failed. Please verify credentials.");
      }
    } catch (err) {
      setLoginError("Login verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ========== LOGIN SCREEN ========== */
  if (!admin) {
    return (
      <div className="psc-login-container">
        <div className="psc-login-grid">
          <div className="psc-login-brand">
            <div className="psc-brand-content">
              <div className="psc-brand-emblem">🏛️</div>
              <h1>Panchayat Secretary Portal</h1>
              <p>Irhpala Gram Panchayat • Ghatal Sub-Division</p>
              <div className="psc-brand-divider"></div>
              <h2>Administrative Desk</h2>
              <p className="psc-brand-tagline">
                Executive secretariat management for rural governance, statutory village records,
                and development schemes.
              </p>
              <div style={{ marginTop: "20px" }}>
                <Link
                  to="/"
                  style={{ color: "#ffffff", fontSize: "0.85rem", textDecoration: "underline" }}
                >
                  ← Return to Public Portal Home
                </Link>
              </div>
            </div>
          </div>

          <div className="psc-login-form-section">
            <div className="psc-form-wrapper">
              <div className="psc-form-header">
                <h3>Secretary & Executive Login</h3>
                <p>Authorized access for Gram Panchayat Secretary and Executive Staff</p>
              </div>

              {loginError && (
                <div className="gov-alert gov-alert-error" style={{ marginBottom: "16px" }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="gov-form">
                <div className="gov-form-group">
                  <label>Official Email ID / Username *</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="secretary@panchayat.gov.in"
                    required
                  />
                </div>

                <div className="gov-form-group">
                  <label>Administrative Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secretary password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="gov-btn gov-btn-primary"
                  disabled={loading}
                  style={{ width: "100%", padding: "12px", marginTop: "10px" }}
                >
                  {loading ? "Authenticating..." : "Sign In to Secretariat Console →"}
                </button>
              </form>

              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <Link to="/admin" style={{ color: "#0f3b6c", fontSize: "0.85rem" }}>
                  ← Return to Department Selection Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (admin.role !== "secretary" && admin.role !== "admin" && admin.role !== "bdo") {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", maxWidth: "600px", margin: "40px auto", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🛡️</div>
        <h2 style={{ color: "#0f3b6c", marginBottom: "10px" }}>Authorized Department Restriction</h2>
        <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: "20px" }}>
          You are signed in as <strong>{admin.name}</strong> ({admin.designation || admin.role?.toUpperCase()}). This console is restricted to the <strong>Gram Panchayat Secretary</strong>.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className="gov-btn gov-btn-outline" onClick={logoutAdmin}>
            Sign Out
          </button>
          <Link to="/admin" className="gov-btn gov-btn-primary">
            Go to Department Hub →
          </Link>
        </div>
      </div>
    );
  }

  /* ========== DASHBOARD ========== */
  return (
    <div className="psc-dashboard">
      <header className="psc-nav">
        <div className="psc-nav-left">
          <span className="psc-nav-icon">🏛️</span>
          <div>
            <h3>Panchayat Secretary Console</h3>
            <small>Irhpala Gram Panchayat • Executive Operations</small>
          </div>
        </div>

        <div className="psc-nav-right">
          <div className="psc-officer">
            <strong>{admin.name}</strong>
            <small>{admin.designation || "Panchayat Secretary"}</small>
          </div>
          <button
            className={`gov-btn psc-logout-btn ${scrolled ? "scrolled" : ""}`}
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="psc-main-content">
        <div className="psc-welcome-banner">
          <div>
            <h2>Secretariat Overview & Gram Panchayat Desk</h2>
            <p>Welcome, {admin.name}. Verify citizen certificate requests and statutory village records.</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="gov-btn gov-btn-primary" onClick={() => navigate("/admin/adminapplications")}>
              📝 Review GP Applications
            </button>
          </div>
        </div>

        <div className="psc-stats-grid">
          <div className="psc-stat-card">
            <span className="psc-stat-icon">🌾</span>
            <div className="psc-stat-info">
              <strong>{villageStats.totalVillages}</strong>
              <small>Revenue Villages</small>
            </div>
          </div>
          <div className="psc-stat-card">
            <span className="psc-stat-icon">👥</span>
            <div className="psc-stat-info">
              <strong>{villageStats.totalPopulation}</strong>
              <small>Citizens Covered</small>
            </div>
          </div>
          <div className="psc-stat-card">
            <span className="psc-stat-icon">🏠</span>
            <div className="psc-stat-info">
              <strong>{villageStats.totalHouseholds}</strong>
              <small>Total Households</small>
            </div>
          </div>
          <div className="psc-stat-card">
            <span className="psc-stat-icon">💰</span>
            <div className="psc-stat-info">
              <strong>{villageStats.fundsUtilized}</strong>
              <small>Development Funds</small>
            </div>
          </div>
        </div>

        <div className="psc-sections-grid">
          <div className="psc-section-card">
            <h3>⚡ Executive Quick Actions</h3>
            <div className="psc-actions-list">
              <Link to="/admin/adminapplications" className="psc-action-item">
                <span className="action-icon">📜</span>
                <div>
                  <strong>Citizen Applications Registry</strong>
                  <p>Verify residential and income certificates submitted by villagers.</p>
                </div>
              </Link>
              <Link to="/admin/Support" className="psc-action-item">
                <span className="action-icon">📞</span>
                <div>
                  <strong>Public Grievances & Redressal</strong>
                  <p>Review complaints regarding drinking water, drainage, and road repairs.</p>
                </div>
              </Link>
              <Link to="/admin/certificates" className="psc-action-item">
                <span className="action-icon">🏛️</span>
                <div>
                  <strong>Elected Member Certificate Desk</strong>
                  <p>Issue digitally verified certificates under member authority.</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="psc-section-card">
            <h3>📋 Statutory Registers & Information</h3>
            <div className="psc-actions-list">
              <div className="psc-action-item static">
                <span className="action-icon">📁</span>
                <div>
                  <strong>Asset & Property Register</strong>
                  <p>Gram Panchayat public land, tubewells, and solar installations.</p>
                </div>
              </div>
              <div className="psc-action-item static">
                <span className="action-icon">🗳️</span>
                <div>
                  <strong>Sansad Meeting Minutes</strong>
                  <p>Permanent record of Gram Sabha resolutions and approved budgets.</p>
                </div>
              </div>
              <div className="psc-action-item static">
                <span className="action-icon">🌾</span>
                <div>
                  <strong>MGNREGS / 100 Days Work Roster</strong>
                  <p>Job card distribution and village labor budget allocation records.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showLogoutModal && (
        <div className="psc-popup-overlay">
          <div className="psc-popup">
            <h3>Exit Secretariat Console</h3>
            <p>Do you want to sign out from the Panchayat Secretary dashboard?</p>
            <div className="psc-popup-btns">
              <button
                className="psc-popup-yes"
                onClick={() => {
                  logoutAdmin();
                  setShowLogoutModal(false);
                }}
              >
                Sign Out
              </button>
              <button className="psc-popup-no" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PSC;