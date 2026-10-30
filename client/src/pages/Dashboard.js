import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { getAssetUrl, API_BASE_URL } from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logoutCitizen } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchApplications = useCallback(async (userId) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/my-applications/${userId}`);
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else {
      fetchApplications(user._id);
    }
  }, [user, navigate, fetchApplications]);

  const handleDownload = async (applicationId) => {
    try {
      setDownloadingId(applicationId);
      const downloadUrl = `${API_BASE_URL}/api/download-certificate/${applicationId}`;
      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download certificate. Please ensure the certificate is approved.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleLogout = () => {
    logoutCitizen();
    navigate("/");
  };

  if (!user) return null;

  // Filter applications
  const filteredApps = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status?.toLowerCase() === filter.toLowerCase();
  });

  const totalApps = applications.length;
  const approvedCount = applications.filter((a) => a.status === "Approved").length;
  const pendingCount = applications.filter((a) => a.status === "Pending" || a.status === "Under Review").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

  return (
    <div className="dash">
      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-emblem">🏛️</span>
            <div>
              <h4>ইরপালা গ্রাম পঞ্চায়েত</h4>
              <small>নাগরিক ড্যাশবোর্ড</small>
            </div>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="sidebar-links">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            🏠 পঞ্চায়েত হোম / Home
          </Link>
          <Link to="/apply-certificate" onClick={() => setSidebarOpen(false)}>
            📄 নতুন সনদপত্র আবেদন / Apply
          </Link>
          <Link to="/certificate-application" onClick={() => setSidebarOpen(false)}>
            📜 সরাসরি আয় সনদপত্র / Income Cert
          </Link>
          <Link to="/download-certificate" onClick={() => setSidebarOpen(false)}>
            ⬇️ সনদপত্র ডাউনলোড / Download
          </Link>
          <Link to="/contact" onClick={() => setSidebarOpen(false)}>
            📢 সমস্যা বা অভিযোগ / Grievance
          </Link>
          <Link to="/manage-profile" onClick={() => setSidebarOpen(false)}>
            👤 প্রোফাইল ও নথি / Profile & Vault
          </Link>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={() => setShowLogoutConfirm(true)}>
            🚪 Logout (লগআউট)
          </button>
        </div>
      </aside>

      {/* Top Navbar */}
      <header className="dash-nav">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Toggle menu">
            ☰
          </button>
          <Link to="/" className="dash-brand-link">
            <img
              src="https://iconape.com/wp-content/files/bt/257232/svg/257232.svg"
              alt="Panchayat Logo"
              className="nav-logo"
            />
            <div className="dash-logo">
              <span>ইরপালা গ্রাম পঞ্চায়েত • Citizen Desk</span>
            </div>
          </Link>
        </div>

        <div className="nav-right">
          <Link to="/manage-profile" className="dash-user">
            {user.photo ? (
              <img src={getAssetUrl(user.photo)} alt={user.name} className="dash-user-img" />
            ) : (
              <div className="dash-user-img-placeholder">{user.name?.charAt(0).toUpperCase()}</div>
            )}
            <div className="dash-user-text">
              <span className="dash-user-name">{user.name}</span>
              <small className="dash-user-village">{user.village || "Paschim Medinipur"}</small>
            </div>
          </Link>

          <button className="dash-logout-quick" onClick={() => setShowLogoutConfirm(true)} title="Logout">
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dash-main">
        {/* Welcome Banner & Action Button */}
        <div className="dash-banner">
          <div>
            <h2>স্বাগতম, {user.name}</h2>
            <p>আপনার সমস্ত ডিজিটাল সনদপত্র ও পঞ্চায়েত আবেদনের বর্তমান স্থিতি এক নজরে দেখুন।</p>
          </div>
          <div className="dash-actions">
            <button className="apply-btn" onClick={() => navigate("/apply-certificate")}>
              📄 নতুন সনদপত্র আবেদন +
            </button>
          </div>
        </div>

        {/* Counter Metric Cards */}
        <div className="dash-metrics-grid">
          <div className={`metric-card ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            <div className="metric-info">
              <span className="metric-label">মোট আবেদন (Total)</span>
              <strong className="metric-count">{totalApps}</strong>
            </div>
            <span className="metric-icon">📑</span>
          </div>

          <div className={`metric-card approved ${filter === "approved" ? "active" : ""}`} onClick={() => setFilter("approved")}>
            <div className="metric-info">
              <span className="metric-label">অনুমোদিত (Approved)</span>
              <strong className="metric-count">{approvedCount}</strong>
            </div>
            <span className="metric-icon">✅</span>
          </div>

          <div className={`metric-card pending ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
            <div className="metric-info">
              <span className="metric-label">প্রক্রিয়াকরণ (Pending)</span>
              <strong className="metric-count">{pendingCount}</strong>
            </div>
            <span className="metric-icon">⏳</span>
          </div>

          <div className={`metric-card rejected ${filter === "rejected" ? "active" : ""}`} onClick={() => setFilter("rejected")}>
            <div className="metric-info">
              <span className="metric-label">বাতিল (Rejected)</span>
              <strong className="metric-count">{rejectedCount}</strong>
            </div>
            <span className="metric-icon">❌</span>
          </div>
        </div>

        {/* Applications Table Card */}
        <div className="applications-card">
          <div className="applications-card-header">
            <h3>আবেদনের বিস্তারিত তালিকা (Applications Status)</h3>
            <span className="count-badge">{filteredApps.length} Applications</span>
          </div>

          {loading ? (
            <div className="table-loading">
              <div className="gov-spinner"></div>
              <p>আবেদনের তথ্য লোড হচ্ছে...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>রেফারেন্স নম্বর (Ref ID)</th>
                    <th>সনদপত্রের ধরণ (Type)</th>
                    <th>আবেদনকারী (Name)</th>
                    <th>মোবাইল নম্বর (Phone)</th>
                    <th>তারিখ (Date)</th>
                    <th>স্থিতি (Status)</th>
                    <th>সার্টিফিকেট (Action)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <strong>{app.applicationNumber || app._id.slice(-8).toUpperCase()}</strong>
                        </td>
                        <td>{app.certificateType || "Residential"}</td>
                        <td>{app.applicantName}</td>
                        <td>{app.mobile}</td>
                        <td>{new Date(app.appliedDate || app.createdAt).toLocaleDateString("en-IN")}</td>
                        <td>
                          <span className={`status-badge ${app.status?.toLowerCase().replace(" ", "_")}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.status === "Approved" ? (
                            <button
                              className="download-btn"
                              onClick={() => handleDownload(app._id)}
                              disabled={downloadingId === app._id}
                              title="Download Official Certificate"
                            >
                              {downloadingId === app._id ? "Downloading..." : "⬇️ Download PDF"}
                            </button>
                          ) : app.status === "Rejected" ? (
                            <div>
                              <span className="rejected-note" title={app.remarks || "No remarks specified"}>
                                ⚠️ Rejected
                              </span>
                              {app.remarks && (
                                <small style={{ display: "block", color: "#b91c1c", marginTop: "4px", fontSize: "0.75rem", lineHeight: 1.3 }}>
                                  Reason: {app.remarks}
                                </small>
                              )}
                            </div>
                          ) : (
                            <span className="pending-note">
                              🔒 Under Verification
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data-cell">
                        <div className="empty-state">
                          <span>📭</span>
                          <h4>কোনো আবেদন পাওয়া যায়নি (No Applications Found)</h4>
                          <p>আপনি এখনো কোনো সনদপত্রের জন্য আবেদন করেননি অথবা বর্তমান ফিল্টারে তথ্য নেই।</p>
                          <button
                            className="gov-btn gov-btn-primary"
                            onClick={() => navigate("/apply-certificate")}
                          >
                            এখনই আবেদন করুন / Apply Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>🚪 Logout Confirmation</h3>
            <p>আপনি কি নিশ্চিত যে আপনি আপনার অ্যাকাউন্ট থেকে লগআউট করতে চান?</p>
            <div className="popup-btns">
              <button className="popup-yes" onClick={handleLogout}>
                হ্যাঁ, লগআউট করুন (Yes)
              </button>
              <button className="popup-no" onClick={() => setShowLogoutConfirm(false)}>
                বাতিল করুন (Cancel)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;