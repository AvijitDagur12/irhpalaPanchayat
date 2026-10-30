import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { getAssetUrl } from "../services/api";
import "./AdminApplications.css";

const AdminApplications = () => {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAuth();

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appFilter, setAppFilter] = useState("all");
  const [appSearch, setAppSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [actionType, setActionType] = useState("Approved");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [rejectionError, setRejectionError] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      setLoadingApps(true);
      const res = await api.get("/api/admin/applications");
      setApplications(res.data || []);
      setFilteredApps(res.data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoadingApps(false);
    }
  }, []);

  useEffect(() => {
    if (!admin) {
      navigate("/admin");
    } else {
      fetchApplications();
    }
  }, [admin, navigate, fetchApplications]);

  useEffect(() => {
    let filtered = [...applications];

    if (appFilter !== "all") {
      filtered = filtered.filter((app) => app.status?.toLowerCase() === appFilter.toLowerCase());
    }

    if (appSearch.trim()) {
      const q = appSearch.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.applicantName?.toLowerCase().includes(q) ||
          app.mobile?.includes(q) ||
          app.email?.toLowerCase().includes(q) ||
          app.applicationNumber?.toLowerCase().includes(q) ||
          app.village?.toLowerCase().includes(q)
      );
    }

    setFilteredApps(filtered);
  }, [appFilter, appSearch, applications]);

  const openActionModal = (app, type) => {
    if (app.status === "Approved") {
      alert("This application has already been permanently approved and sealed.");
      return;
    }
    setSelectedApp(app);
    setActionType(type);
    setRemarks(type === "Approved" ? "Official documents and Elected Member Certificate verified and approved." : "");
    setRejectionError("");
    setShowConfirm(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp || statusUpdating) return;

    if (actionType === "Rejected" && !remarks.trim()) {
      setRejectionError("A specific rejection reason is required before rejecting this application.");
      return;
    }

    try {
      setStatusUpdating(true);
      setRejectionError("");
      await api.put(`/api/admin/application/${selectedApp._id}`, {
        status: actionType,
        remarks: remarks.trim(),
      });

      await fetchApplications();
      setShowConfirm(false);
      setSelectedApp(null);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update application status: " + (err.response?.data?.error || err.message));
    } finally {
      setStatusUpdating(false);
    }
  };

  const ImageModal = ({ image, onClose }) => (
    <div className="image-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>
        <img src={getAssetUrl(image)} alt="Document preview" />
      </div>
    </div>
  );

  return (
    <div className="admin-applications-page">
      {/* HEADER */}
      <div className="admin-app-header">
        <div className="header-left">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="State Emblem of India"
            className="govt-logo"
            style={{ filter: "brightness(0) invert(1)" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://iconape.com/wp-content/files/bt/257232/svg/257232.svg";
            }}
          />
          <div className="header-title">
            <h1>Gram Panchayat Certificate Desk</h1>
            <p>Panchayat Secretary (PSC) Console • Irhpala Gram Panchayat Verification Desk</p>
          </div>
        </div>
        <div className="header-right" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="psc-admin-badge">
            <strong>Mr. {admin?.name || "Test Admin"}</strong>
            <small>{admin?.designation || "Panchayat Secretary"}</small>
          </div>
          <button
            className="gov-btn gov-btn-outline"
            onClick={fetchApplications}
            style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)", borderRadius: 0, borderWidth: "2px" }}
            title="Refresh Applications"
          >
            🔄 Refresh
          </button>
          <button
            className={`gov-btn gov-btn-outline psc-app-logout ${scrolled ? "scrolled" : ""}`}
            onClick={() => setShowLogoutModal(true)}
            style={{ borderRadius: 0, borderWidth: "2px" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="desk-tab-content" style={{ marginTop: "20px" }}>
        {/* Stats Bar */}
        <div className="app-stats-bar">
          <div className={`stat-item ${appFilter === "all" ? "active" : ""}`} onClick={() => setAppFilter("all")}>
            <span className="stat-value">{applications.length}</span>
            <span className="stat-label">Total Applications</span>
          </div>
          <div className={`stat-item ${appFilter === "pending" ? "active" : ""}`} onClick={() => setAppFilter("pending")}>
            <span className="stat-value">
              {applications.filter((a) => a.status === "Pending" || a.status === "Under Review").length}
            </span>
            <span className="stat-label">Pending Verification</span>
          </div>
          <div className={`stat-item ${appFilter === "approved" ? "active" : ""}`} onClick={() => setAppFilter("approved")}>
            <span className="stat-value">{applications.filter((a) => a.status === "Approved").length}</span>
            <span className="stat-label">Approved & Sealed</span>
          </div>
          <div className={`stat-item ${appFilter === "rejected" ? "active" : ""}`} onClick={() => setAppFilter("rejected")}>
            <span className="stat-value">{applications.filter((a) => a.status === "Rejected").length}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>

        {/* Filters */}
        <div className="app-filters">
          <div className="filter-group">
            <label>Status Filter:</label>
            <select value={appFilter} onChange={(e) => setAppFilter(e.target.value)}>
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved (Permanent)</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="search-group" style={{ flexGrow: 1 }}>
            <input
              type="text"
              placeholder="🔍 Search by Ref ID, applicant name, village, or mobile..."
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="applications-table-container">
          {loadingApps ? (
            <div className="table-loading" style={{ padding: "40px", textAlign: "center" }}>
              <div className="gov-spinner" style={{ margin: "0 auto 12px" }}></div>
              <p>Loading Gram Panchayat application repository...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-app-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Reference & Applicant</th>
                    <th>Certificate Details</th>
                    <th>Village & Address</th>
                    <th>Contact Info</th>
                    <th>Elected Member & Attached Documents</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Secretary Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                      <tr key={app._id} className={app.status === "Approved" ? "row-approved" : ""}>
                        <td className="photo-cell">
                          {app.photo ? (
                            <img
                              src={getAssetUrl(app.photo)}
                              alt="Applicant"
                              className="applicant-thumb"
                              onClick={() => setSelectedImage(app.photo)}
                              title="Click to zoom photograph"
                            />
                          ) : (
                            <div className="no-photo">📷</div>
                          )}
                        </td>
                        <td>
                          <strong>{app.applicantName}</strong>
                          <div style={{ fontSize: "0.78rem", color: "#0f3b6c", fontWeight: "600" }}>
                            Ref: {app.applicationNumber || app._id.slice(-8).toUpperCase()}
                          </div>
                          <small style={{ color: "#64748b" }}>
                            S/O or D/O: {app.guardianName} ({app.relation || "Guardian"})
                          </small>
                        </td>
                        <td>
                          <span className="cert-type">{app.certificateType}</span>
                          {app.annualIncome && (
                            <div style={{ fontSize: "0.78rem", color: "#166534", marginTop: "2px" }}>
                              Income: ₹{app.annualIncome}
                            </div>
                          )}
                        </td>
                        <td>
                          <strong>{app.village}</strong>
                          <small style={{ display: "block", color: "#64748b" }}>
                            P.O: {app.post || "Irhpala"}, PIN: {app.pin || "721212"}
                          </small>
                        </td>
                        <td>
                          <div>📞 {app.mobile}</div>
                          {app.email && <small style={{ color: "#64748b" }}>✉️ {app.email}</small>}
                        </td>
                        <td>
                          <div className="doc-links-cell">
                            {app.gsCertificate ? (
                              <a
                                href={getAssetUrl(app.gsCertificate)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="doc-pill"
                                style={{ background: "#ecfdf5", borderColor: "#10b981", color: "#065f46", fontWeight: "700" }}
                                title="Statutory Prerequisite: Elected Member Certificate PDF/Photo"
                              >
                                📜 Member Cert (Verified)
                              </a>
                            ) : (
                              <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: "600" }}>
                                ⚠️ No Member Cert
                              </span>
                            )}
                            {app.doc1File && (
                              <a href={getAssetUrl(app.doc1File)} target="_blank" rel="noopener noreferrer" className="doc-pill">
                                📄 {app.doc1Type || "Doc 1"}
                              </a>
                            )}
                            {app.doc2File && (
                              <a href={getAssetUrl(app.doc2File)} target="_blank" rel="noopener noreferrer" className="doc-pill">
                                📄 {app.doc2Type || "Doc 2"}
                              </a>
                            )}
                          </div>
                        </td>
                        <td>{new Date(app.appliedDate || app.createdAt).toLocaleDateString("en-IN")}</td>
                        <td>
                          <span className={`status-badge ${app.status?.toLowerCase().replace(" ", "_")}`}>
                            {app.status === "Approved" ? "✓ Approved" : app.status}
                          </span>
                          {app.status === "Rejected" && app.remarks && (
                            <small style={{ display: "block", color: "#b91c1c", marginTop: "4px", fontSize: "0.72rem" }}>
                              Reason: {app.remarks}
                            </small>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons-cell">
                            {app.status === "Approved" ? (
  <span className="status-locked-badge" title="Permanently Approved and Sealed in Registry">
    🔒 Approved & Sealed
  </span>
) : (
  <>
    <button
      className="gov-btn gov-btn-secondary btn-sm"
      onClick={() => openActionModal(app, "Approved")}
    >
      ✓ Approve
    </button>
    {app.status !== "Rejected" && (
      <button
        className="gov-btn gov-btn-outline btn-sm"
        style={{ color: "#b91c1c", borderColor: "#fecaca" }}
        onClick={() => openActionModal(app, "Rejected")}
      >
        ✕ Reject
      </button>
    )}
  </>
)}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                        No Gram Panchayat certificate applications found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}

      {/* Confirm Modal */}
      {showConfirm && selectedApp && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal" style={{ borderRadius: 0, border: "2px solid #0f3b6c" }}>
            <h3>{actionType === "Approved" ? "✓ Approve Gram Panchayat Certificate" : "✕ Reject Certificate Application"}</h3>
            <p>
              Applicant: <strong>{selectedApp.applicantName}</strong> (Ref: {selectedApp.applicationNumber || selectedApp._id})
            </p>
            {actionType === "Approved" && (
              <p style={{ color: "#b45309", fontSize: "0.825rem", margin: "8px 0" }}>
                ⚠️ Notice: Approved applications are permanent and sealed. A digital certificate with official seal will be generated.
              </p>
            )}

            {rejectionError && (
              <div className="gov-alert gov-alert-error" style={{ margin: "8px 0", fontSize: "0.85rem" }}>
                {rejectionError}
              </div>
            )}

            <div style={{ textAlign: "left", margin: "14px 0" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                {actionType === "Approved" ? "Approval Remarks / Notes:" : "Specific Rejection Reason *:"}
              </label>
              <textarea
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  setRejectionError("");
                }}
                rows="3"
                style={{ width: "100%", padding: "8px", border: "2px solid #cbd5e1", borderRadius: 0 }}
                placeholder={actionType === "Approved" ? "e.g., All documents and Elected Member Certificate verified." : "e.g., Uploaded Elected Member Certificate is illegible / mismatched name."}
                required={actionType === "Rejected"}
              ></textarea>
            </div>

            <div className="confirm-buttons">
              <button
                className={actionType === "Approved" ? "confirm-yes" : "confirm-reject"}
                onClick={handleUpdateStatus}
                disabled={statusUpdating}
                style={{ borderRadius: 0 }}
              >
                {statusUpdating ? "Recording..." : `Confirm ${actionType}`}
              </button>
              <button className="confirm-no" onClick={() => setShowConfirm(false)} disabled={statusUpdating} style={{ borderRadius: 0 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal" style={{ borderRadius: 0, border: "2px solid #0f3b6c" }}>
            <h3>Exit Certificate Desk</h3>
            <p>Do you want to sign out from the Panchayat Secretary console?</p>
            <div className="confirm-buttons">
              <button
                className="confirm-yes"
                onClick={() => {
                  logoutAdmin();
                  setShowLogoutModal(false);
                }}
                style={{ borderRadius: 0 }}
              >
                Sign Out
              </button>
              <button className="confirm-no" onClick={() => setShowLogoutModal(false)} style={{ borderRadius: 0 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;