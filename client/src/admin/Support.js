import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { getAssetUrl } from "../services/api";
import "./Support.css";

const Support = () => {
  const { admin, loginAdmin, logoutAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [stats, setStats] = useState({ total: 0, pending: 0, read: 0, replied: 0 });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const calculateStats = useCallback((data) => {
    setStats({
      total: data.length,
      pending: data.filter((c) => c.status?.toLowerCase() === "pending").length,
      read: data.filter((c) => c.status?.toLowerCase() === "read").length,
      replied: data.filter(
        (c) => c.status?.toLowerCase() === "replied" || c.status?.toLowerCase() === "resolved"
      ).length,
    });
  }, []);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/contacts");
      if (response.data && response.data.success) {
        const data = response.data.data || [];
        setComplaints(data);
        calculateStats(data);
        if (!selectedComplaint && data.length > 0) {
          const firstPending = data.find((c) => c.status?.toLowerCase() === "pending") || data[0];
          setSelectedComplaint(firstPending);
          setReplyText(firstPending.adminReply || "");
        }
      }
    } catch (error) {
      console.error("Error fetching grievances:", error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats, selectedComplaint]);

  useEffect(() => {
    if (admin) fetchComplaints();
  }, [admin, fetchComplaints]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        setEmail("");
        setPassword("");
      } else {
        setLoginError(res.error || "Authentication failed. Please check credentials.");
      }
    } catch (err) {
      setLoginError("Login verification failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const isLocked = (status) =>
    status?.toLowerCase() === "resolved" || status?.toLowerCase() === "replied";

  const updateStatus = async (id, newStatus) => {
    // Block status change if already resolved
    const current = complaints.find((c) => c._id === id);
    if (current && isLocked(current.status)) {
      setStatusError("This grievance is resolved and locked. Status cannot be changed.");
      return;
    }

    try {
      setUpdating(true);
      setStatusError("");
      const payload = { status: newStatus.toLowerCase() };
      if (replyText.trim()) payload.adminReply = replyText.trim();

      const response = await api.put(`/api/contact/${id}`, payload);
      if (response.data && response.data.success) {
        const updated = complaints.map((c) =>
          c._id === id ? { ...c, status: newStatus.toLowerCase(), adminReply: replyText } : c
        );
        setComplaints(updated);
        calculateStats(updated);
        if (selectedComplaint && selectedComplaint._id === id) {
          setSelectedComplaint({
            ...selectedComplaint,
            status: newStatus.toLowerCase(),
            adminReply: replyText,
          });
        }
      }
    } catch (error) {
      console.error("Error updating grievance status:", error);
      alert("Failed to update status: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const getSubjectName = (subject) => {
    const subjects = {
      certificate: "Certificate Related",
      scheme: "Scheme Related",
      complaint: "Public Grievance",
      water: "Water Supply & Tubewell",
      road: "Road & Drainage Problem",
      other: "General Issue",
    };
    return subjects[subject] || subject;
  };

  /* ---------- LOGIN ---------- */
  if (!admin) {
    return (
      <div className="support-login-page">
        <div className="support-login-card">
          <div className="support-login-header">
            <span className="support-login-icon">📢</span>
            <h2>Grievance Redressal Desk</h2>
            <p>Irhpala Gram Panchayat • Public Issues Redressal Officer Login</p>
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="support@panchayat.gov.in"
                required
              />
            </div>

            <div className="gov-form-group">
              <label>Administrative Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="gov-btn gov-btn-primary support-login-btn"
              disabled={loginLoading}
            >
              {loginLoading ? "Authenticating..." : "Access Grievance Desk →"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link to="/admin" style={{ color: "#0f3b6c", fontSize: "0.85rem" }}>
              ← Return to Department Selection Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- ROLE CHECK ---------- */
  if (admin.role !== "support" && admin.role !== "admin" && admin.role !== "bdo") {
    return (
      <div className="support-restriction-page">
        <div className="support-restriction-card">
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🛡️</div>
          <h2>Authorized Department Restriction</h2>
          <p>
            You are signed in as <strong>{admin.name}</strong> ({admin.designation || admin.role?.toUpperCase()}).
            This console is restricted to the <strong>Public Grievance Redressal Officer</strong>.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
            <button className="gov-btn gov-btn-outline" onClick={logoutAdmin}>Sign Out</button>
            <Link to="/admin" className="gov-btn gov-btn-primary">Go to Department Hub →</Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredComplaints = complaints.filter((c) => {
    const matchesFilter = filter === "all" || c.status?.toLowerCase() === filter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;
    return (
      matchesFilter &&
      (c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.ticketNumber?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q))
    );
  });

  const selectedLocked = selectedComplaint && isLocked(selectedComplaint.status);
  const phoneClean = selectedComplaint?.phone?.replace(/[^0-9]/g, "") || "";

  /* ---------- DASHBOARD ---------- */
  return (
    <div className="support-dashboard">
      <header className="support-nav">
        <div className="support-nav-left">
          <span className="support-nav-icon">📢</span>
          <div>
            <h1>Grievance Redressal Officer Desk</h1>
            <p>Irhpala Gram Panchayat • Public Issues & Feedback Redressal System</p>
          </div>
        </div>

        <div className="support-nav-right">
          <div className="support-officer-badge">
            <strong>{admin.name}</strong>
            <small>{admin.designation || "Grievance Officer"}</small>
          </div>
          <button className="gov-btn support-refresh-btn" onClick={fetchComplaints}>
            🔄 Refresh
          </button>
          <button
            className={`gov-btn support-logout-btn ${scrolled ? "scrolled" : ""}`}
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats chips — permanent colours */}
      <div className="support-stats-bar">
        <div className={`support-stat-chip total ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          <span>Total Grievances</span>
          <strong>{stats.total}</strong>
        </div>
        <div className={`support-stat-chip pending ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
          <span>Awaiting Review</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className={`support-stat-chip read ${filter === "read" ? "active" : ""}`} onClick={() => setFilter("read")}>
          <span>Under Investigation</span>
          <strong>{stats.read}</strong>
        </div>
        <div className={`support-stat-chip replied ${filter === "replied" ? "active" : ""}`} onClick={() => setFilter("replied")}>
          <span>Resolved / Replied</span>
          <strong>{stats.replied}</strong>
        </div>
      </div>

      {/* Short search box */}
      <div className="support-search-bar">
        <input
          type="text"
          placeholder="🔍 Search grievances..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="support-main-grid">
        {/* Inbox */}
        <div className="complaints-list-panel">
          <div className="panel-title">
            <span>Inbox</span>
            <span className="panel-count">{filteredComplaints.length}</span>
          </div>

          {loading ? (
            <div className="support-loading">
              <div className="gov-spinner"></div>
              <p>Loading grievance stream...</p>
            </div>
          ) : (
            <div className="complaint-items-wrapper">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <div
                    key={c._id}
                    className={`complaint-list-item ${selectedComplaint?._id === c._id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedComplaint(c);
                      setReplyText(c.adminReply || "");
                      setStatusError("");
                    }}
                  >
                    <div className="item-header">
                      <strong>{c.name}</strong>
                      <span className={`support-status-badge ${c.status?.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="item-subject">
                      {c.ticketNumber && <span className="ticket-tag">[{c.ticketNumber}]</span>}
                      {getSubjectName(c.subject)}
                    </div>
                    <p className="item-preview">
                      {c.message?.substring(0, 75)}{c.message?.length > 75 ? "..." : ""}
                    </p>
                    <div className="item-footer">
                      <small>📞 {c.phone}</small>
                      <small>{new Date(c.submittedAt || c.createdAt).toLocaleDateString("en-IN")}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="support-empty">
                  <span>📭</span>
                  <p>No grievances found matching criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="complaint-detail-panel">
          {selectedComplaint ? (
            <div className="complaint-detail-content">
              <div className="detail-header">
                <div>
                  <h2>{getSubjectName(selectedComplaint.subject)}</h2>
                  <div className="detail-ticket-row">
                    <span className="ticket-tag">
                      Ticket: {selectedComplaint.ticketNumber || selectedComplaint._id}
                    </span>
                    <span className={`support-status-badge ${selectedComplaint.status?.toLowerCase()}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>
                <div className="detail-meta">
                  📅 {new Date(selectedComplaint.submittedAt || selectedComplaint.createdAt).toLocaleDateString("en-IN")}
                </div>
              </div>

              {/* Citizen info + direct contact buttons */}
              <div className="citizen-info-box">
                <div><strong>Citizen Name:</strong> {selectedComplaint.name}</div>
                <div><strong>Mobile:</strong> 📞 {selectedComplaint.phone}</div>
                {selectedComplaint.email && (
                  <div><strong>Email:</strong> ✉️ {selectedComplaint.email}</div>
                )}

                <div className="citizen-contact-actions">
                  <a
                    href={`tel:${phoneClean}`}
                    className="contact-btn call-btn"
                    title="Call citizen"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/91${phoneClean}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-btn wa-btn"
                    title="WhatsApp citizen"
                  >
                    💬 WhatsApp
                  </a>
                  {selectedComplaint.email && (
                    <a
                      href={`mailto:${selectedComplaint.email}?subject=Grievance ${selectedComplaint.ticketNumber || ""}`}
                      className="contact-btn mail-btn"
                      title="Email citizen"
                    >
                      ✉️ Email
                    </a>
                  )}
                </div>
              </div>

              <div className="detail-message-box">
                <h4>Citizen Grievance Description:</h4>
                <p>{selectedComplaint.message}</p>
              </div>

              {selectedComplaint.image && (
                <div className="detail-attachment">
                  <h4>Uploaded Evidence / Photo:</h4>
                  <a href={getAssetUrl(selectedComplaint.image)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={getAssetUrl(selectedComplaint.image)}
                      alt="Grievance evidence"
                      className="complaint-img-preview"
                    />
                  </a>
                </div>
              )}

              <div className="reply-section">
                <h4>Official Redressal Response & Action</h4>

                {statusError && (
                  <div className="gov-alert gov-alert-error" style={{ marginBottom: "12px" }}>
                    {statusError}
                  </div>
                )}

                {selectedLocked ? (
                  <div className="locked-notice">
                    🔒 This grievance is <strong>{selectedComplaint.status}</strong>. Status cannot be changed further.
                  </div>
                ) : (
                  <div className="status-action-btns">
                    <button
                      className={`status-btn ${selectedComplaint.status === "pending" ? "current" : ""}`}
                      onClick={() => updateStatus(selectedComplaint._id, "pending")}
                      disabled={updating}
                    >
                      Mark Pending
                    </button>
                    <button
                      className={`status-btn ${selectedComplaint.status === "read" ? "current" : ""}`}
                      onClick={() => updateStatus(selectedComplaint._id, "read")}
                      disabled={updating}
                    >
                      Mark In Review
                    </button>
                    <button
                      className={`status-btn resolve ${selectedComplaint.status === "resolved" ? "current" : ""}`}
                      onClick={() => updateStatus(selectedComplaint._id, "resolved")}
                      disabled={updating}
                    >
                      ✓ Mark Resolved (Permanent)
                    </button>
                  </div>
                )}

                <div className="reply-box">
                  <label>Official Response (Saved in database for citizen record):</label>
                  <textarea
                    rows="4"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enter official redressal response or steps taken..."
                    disabled={selectedLocked}
                  />
                  <div className="reply-actions">
                    <button
                      className="gov-btn gov-btn-secondary"
                      onClick={() => updateStatus(selectedComplaint._id, selectedComplaint.status || "resolved")}
                      disabled={updating || selectedLocked}
                    >
                      {updating ? "Saving..." : "Save Response & Redressal"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="support-select-prompt">
              <span>📋</span>
              <h3>Select a grievance from the inbox</h3>
              <p>Choose an item on the left to inspect details, review citizen evidence, and submit redressal.</p>
            </div>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <div className="support-popup-overlay">
          <div className="support-popup">
            <h3>Exit Grievance Desk</h3>
            <p>Do you want to sign out from the Grievance Redressal console?</p>
            <div className="support-popup-btns">
              <button
                className="support-popup-yes"
                onClick={() => {
                  logoutAdmin();
                  setShowLogoutModal(false);
                }}
              >
                Sign Out
              </button>
              <button className="support-popup-no" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;