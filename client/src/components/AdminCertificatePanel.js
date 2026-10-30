import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AdminCertificatePanel.css";

const AdminCertificatePanel = () => {
  const { admin, loginAdmin, logoutAdmin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [ticketSearch, setTicketSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [approveModalApp, setApproveModalApp] = useState(null);
  const [rejectModalApp, setRejectModalApp] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Track scroll for logout button red effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const calculateStats = useCallback((data) => {
    setStats({
      total: data.length,
      pending: data.filter((app) => app.status === "Pending").length,
      approved: data.filter((app) => app.status === "Approved").length,
      rejected: data.filter((app) => app.status === "Rejected").length,
    });
  }, []);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/certificates");
      if (response.data && response.data.success) {
        setApplications(response.data.data || []);
        calculateStats(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const filterApplications = useCallback(() => {
    let filtered = [...applications];

    if (ticketSearch.trim()) {
      const term = ticketSearch.trim().toLowerCase();
      filtered = filtered.filter((app) =>
        app.ticketId?.toLowerCase().includes(term)
      );
    }

    if (nameSearch.trim()) {
      const term = nameSearch.trim().toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.applicantName?.toLowerCase().includes(term) ||
          app.fatherName?.toLowerCase().includes(term) ||
          app.village?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    setFilteredApplications(filtered);
  }, [applications, ticketSearch, nameSearch, filterStatus]);

  useEffect(() => {
    if (admin) fetchApplications();
  }, [admin, fetchApplications]);

  useEffect(() => {
    filterApplications();
  }, [filterApplications]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        setUsername("");
        setPassword("");
      } else {
        setLoginError(res.error || "Invalid administrative credentials.");
      }
    } catch (err) {
      setLoginError("Login verification failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const openApproveModal = (app) => setApproveModalApp(app);

  const handleConfirmApprove = async () => {
    if (!approveModalApp) return;
    try {
      setSubmittingStatus(true);
      const response = await api.put(`/api/certificate/${approveModalApp._id}`, {
        status: "Approved",
        remarks: "Approved under Panchayat Elected Member authority.",
      });
      if (response.data && response.data.success) {
        fetchApplications();
        setApproveModalApp(null);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to approve certificate: " + error.message);
    } finally {
      setSubmittingStatus(false);
    }
  };

  const openRejectModal = (app) => {
    setRejectModalApp(app);
    setRejectionReason("");
    setRejectionError("");
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError("Please provide a specific rejection reason for the citizen record.");
      return;
    }
    try {
      setSubmittingStatus(true);
      setRejectionError("");
      const response = await api.put(`/api/certificate/${rejectModalApp._id}`, {
        status: "Rejected",
        remarks: rejectionReason.trim(),
      });
      if (response.data && response.data.success) {
        fetchApplications();
        setRejectModalApp(null);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Status update error:", error);
      setRejectionError("Failed to reject certificate: " + error.message);
    } finally {
      setSubmittingStatus(false);
    }
  };

  if (!admin) {
    return (
      <div className="admin-cert-login-page">
        <div className="admin-cert-login-card">
          <div className="login-header">
            <span className="login-icon">🏛️</span>
            <h2>Elected Member Certificate Desk</h2>
            <p>Irhpala Gram Panchayat • Official Pradhan / Member Console</p>
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
                placeholder="user@irhpala.in"
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
            <button type="submit" className="gov-btn gov-btn-primary" disabled={loginLoading} style={{ width: "100%", padding: "12px", marginTop: "10px" }}>
              {loginLoading ? "Authenticating..." : "Access Certificate Desk →"}
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

  if (admin.role !== "member" && admin.role !== "elected_member" && admin.role !== "admin" && admin.role !== "bdo") {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", maxWidth: "600px", margin: "40px auto", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🛡️</div>
        <h2 style={{ color: "#0f3b6c", marginBottom: "10px" }}>Authorized Department Restriction</h2>
        <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: "20px" }}>
          You are signed in as <strong>{admin.name}</strong> ({admin.designation || admin.role?.toUpperCase()}). This console is restricted to <strong>Elected Panchayat Members</strong>.
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

  return (
    <div className="admin-cert-container">
      <header className="admin-cert-header">
        <div className="header-brand">
          <span className="brand-badge">🏛️</span>
          <div>
            <h1>Elected Member Certificate Desk</h1>
            <small>Irhpala Gram Panchayat • Welcome</small>
          </div>
        </div>

        <div className="header-user-actions">
          <div className="officer-badge">
            <strong>{admin.name}</strong>
            <small>{admin.designation || "Panchayat Member"}</small>
          </div>
          <button
            className={`gov-btn cert-logout-btn ${scrolled ? "scrolled" : ""}`}
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="cert-page-heading">
        <h2>NABAB KHAN - MEMBER</h2>
        <p>
          নির্বাচিত সদস্য আয় সনদপত্রের আবেদনসমূহ পর্যালোচনা, যাচাই ও প্রয়োজনীয় ব্যবস্থা গ্রহণ করুন।
          একবার আবেদন অনুমোদিত হলে তা <strong>স্থায়ী হয় এবং আর পরিবর্তন করা যাবে না</strong>।
        </p>
      </div>

      <div className="cert-stats-bar">
        <div className={`cert-stat-chip ${filterStatus === "All" ? "active" : ""}`} onClick={() => setFilterStatus("All")}>
          <span>Total Applications:</span>
          <strong>{stats.total}</strong>
        </div>
        <div className={`cert-stat-chip pending ${filterStatus === "Pending" ? "active" : ""}`} onClick={() => setFilterStatus("Pending")}>
          <span>Pending Review:</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className={`cert-stat-chip approved ${filterStatus === "Approved" ? "active" : ""}`} onClick={() => setFilterStatus("Approved")}>
          <span>Approved:</span>
          <strong>{stats.approved}</strong>
        </div>
        <div className={`cert-stat-chip rejected ${filterStatus === "Rejected" ? "active" : ""}`} onClick={() => setFilterStatus("Rejected")}>
          <span>Rejected:</span>
          <strong>{stats.rejected}</strong>
        </div>
      </div>

      <div className="cert-filter-toolbar">
        <div className="search-box" style={{ flexGrow: 1 }}>
          <input
            type="text"
            placeholder="🎫 Search by Ticket ID (e.g. TKT-XXXX)..."
            value={ticketSearch}
            onChange={(e) => setTicketSearch(e.target.value)}
          />
        </div>
        <div className="search-box" style={{ flexGrow: 1 }}>
          <input
            type="text"
            placeholder="🔍 Search by Applicant Name, Father Name, or Village..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </div>
        <button className="gov-btn gov-btn-outline" onClick={fetchApplications}>
          🔄 Refresh
        </button>
      </div>

      <main className="cert-table-wrapper">
        {loading ? (
          <div className="table-loading" style={{ padding: "40px", textAlign: "center" }}>
            <div className="gov-spinner" style={{ margin: "0 auto 10px" }}></div>
            <p>Loading certificate applications...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Applicant Name</th>
                  <th>Father / Guardian</th>
                  <th>Village & P.O.</th>
                  <th>Monthly Income</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Verification Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr key={app._id}>
                      <td><strong>{app.ticketId || "—"}</strong></td>
                      <td><strong>{app.applicantName}</strong></td>
                      <td>{app.fatherName}</td>
                      <td>{app.village}, P.O: {app.postOffice}</td>
                      <td><strong>₹{app.monthlyIncome}</strong>/mo</td>
                      <td>{new Date(app.submittedAt || app.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <span className={`status-badge ${app.status?.toLowerCase()}`}>{app.status}</span>
                        {app.status === "Rejected" && app.remarks && (
                          <small style={{ display: "block", color: "#b91c1c", marginTop: "3px", fontSize: "0.72rem" }}>
                            Reason: {app.remarks}
                          </small>
                        )}
                        {app.status === "Approved" && (
                          <small style={{ display: "block", color: "#166534", marginTop: "3px", fontSize: "0.72rem" }}>
                            🔒 Permanent
                          </small>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {app.status === "Pending" && (
                            <>
                              <button
                                className="gov-btn gov-btn-secondary"
                                style={{ padding: "4px 8px", fontSize: "0.78rem" }}
                                onClick={() => openApproveModal(app)}
                                disabled={submittingStatus}
                              >
                                ✓ Approve
                              </button>
                              <button
                                className="gov-btn gov-btn-outline"
                                style={{ padding: "4px 8px", fontSize: "0.78rem", color: "#b91c1c", borderColor: "#fecaca" }}
                                onClick={() => openRejectModal(app)}
                                disabled={submittingStatus}
                              >
                                ✕ Reject
                              </button>
                            </>
                          )}
                          {app.status !== "Pending" && (
                            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                              {app.status === "Approved" ? "No further action (permanent)" : "Rejected — no further action"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                      No certificate applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {approveModalApp && (
        <div className="logout-popup-overlay">
          <div className="logout-popup" style={{ maxWidth: "480px", textAlign: "left" }}>
            <h3 style={{ color: "#166534" }}>✓ Confirm Certificate Approval</h3>
            <p style={{ margin: "4px 0 12px", color: "#64748b", fontSize: "0.85rem" }}>
              Applicant: <strong>{approveModalApp.applicantName}</strong> (Ticket: <strong>{approveModalApp.ticketId}</strong>)
            </p>
            <div className="gov-alert gov-alert-error" style={{ marginBottom: "12px", fontSize: "0.85rem", background: "#fef2f2", color: "#991b1b" }}>
              ⚠️ <strong>Warning:</strong> Approval is <strong>permanent and irreversible</strong>. Once approved, this certificate cannot be rejected, edited, or reverted. Please verify all details carefully before confirming.
            </div>
            <div className="popup-btns" style={{ justifyContent: "flex-end", marginTop: "16px" }}>
              <button className="popup-yes" style={{ background: "#166534" }} onClick={handleConfirmApprove} disabled={submittingStatus}>
                {submittingStatus ? "Approving..." : "Yes, Approve Permanently"}
              </button>
              <button className="popup-no" onClick={() => setApproveModalApp(null)} disabled={submittingStatus}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModalApp && (
        <div className="logout-popup-overlay">
          <div className="logout-popup" style={{ maxWidth: "480px", textAlign: "left" }}>
            <h3 style={{ color: "#b91c1c" }}>✕ Reject Elected Member Certificate</h3>
            <p style={{ margin: "4px 0 12px", color: "#64748b", fontSize: "0.85rem" }}>
              Applicant: <strong>{rejectModalApp.applicantName}</strong> (Ticket: <strong>{rejectModalApp.ticketId}</strong>)
            </p>
            {rejectionError && (
              <div className="gov-alert gov-alert-error" style={{ marginBottom: "12px", fontSize: "0.85rem" }}>
                {rejectionError}
              </div>
            )}
            <div style={{ margin: "12px 0" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px", color: "#334155" }}>
                Specific Rejection Reason * (Will be shown to citizen when tracking ticket):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => { setRejectionReason(e.target.value); setRejectionError(""); }}
                rows="3"
                style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "0.88rem" }}
                placeholder="e.g. Village ward mismatch / Applicant monthly income declaration requires further verification."
                required
              ></textarea>
            </div>
            <div className="popup-btns" style={{ justifyContent: "flex-end", marginTop: "16px" }}>
              <button className="popup-yes" style={{ background: "#dc2626" }} onClick={handleConfirmReject} disabled={submittingStatus}>
                {submittingStatus ? "Rejecting..." : "Confirm Rejection"}
              </button>
              <button className="popup-no" onClick={() => setRejectModalApp(null)} disabled={submittingStatus}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>Exit Certificate Desk</h3>
            <p>Do you want to sign out from the member certificate console?</p>
            <div className="popup-btns">
              <button className="popup-yes" onClick={() => { logoutAdmin(); setShowLogoutModal(false); }}>
                Sign Out
              </button>
              <button className="popup-no" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificatePanel;