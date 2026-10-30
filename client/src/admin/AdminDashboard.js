import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalApplications: 0,
    totalCitizens: 0,
    reportsCount: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });

  const [reports, setReports] = useState({
    certificatesIssued: 0,
    meetingsHeld: 12,
    complaintsResolved: 0,
    schemesLaunched: 8,
    beneficiaries: 0,
    fundsUtilized: "₹18,75,000",
  });

  const [recentActivities, setRecentActivities] = useState([]);

  const upcomingMeetings = [
    { id: 1, title: "Gram Sabha General Meeting", date: "28 April 2026", time: "11:00 AM", venue: "Irhpala Panchayat Office Hall" },
    { id: 2, title: "Mission Nirmal Bangla Review", date: "02 May 2026", time: "10:30 AM", venue: "Ghatal BDO Office" },
    { id: 3, title: "Public Grievance Redressal Camp", date: "08 May 2026", time: "11:00 AM", venue: "Joykundu Community Center" },
  ];

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/stats");
      if (res.data && res.data.success) {
        setStats(res.data.stats || {});
        setReports(res.data.reports || {});
        if (res.data.recentActivities && res.data.recentActivities.length > 0) {
          setRecentActivities(res.data.recentActivities);
        } else {
          setRecentActivities([
            { id: 1, action: "Residential Certificate Application", time: "Recent", user: "Village Citizen", village: "Irhpala" },
            { id: 2, action: "Income Certificate Approved", time: "Recent", user: "Verified Citizen", village: "Ghatal" },
          ]);
        }
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!admin) {
      navigate("/admin");
    } else {
      fetchDashboardData();
    }
  }, [admin, navigate, fetchDashboardData]);

  const handleConfirmLogout = () => {
    logoutAdmin();
    navigate("/admin");
  };

  if (!admin) return null;

  return (
    <div className="admin-container">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="Emblem"
            className="admin-emblem"
          />
          <div>
            <h1>Irhpala Gram Panchayat Administration</h1>
            <p>Block Development Office • Ghatal, Paschim Medinipur</p>
          </div>
        </div>

        <div className="admin-header-right">
          <div className="admin-user-profile">
            <div className="admin-avatar">{admin.name?.charAt(0).toUpperCase()}</div>
            <div className="admin-info">
              <strong>{admin.name}</strong>
              <small>{admin.designation || admin.role?.toUpperCase()}</small>
            </div>
          </div>
          <button className="gov-btn gov-btn-outline" onClick={() => setShowLogoutModal(true)}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav className="admin-subnav">
        <div className="admin-subnav-links">
          <Link to="/admin/dashboard" className="admin-subnav-item active">
            📊 Overview
          </Link>
          <Link to="/admin/adminapplications" className="admin-subnav-item">
            📝 Certificate Applications ({stats.pendingApplications || 0} Pending)
          </Link>
          <Link to="/admin/Support" className="admin-subnav-item">
            📢 Grievance Cell ({stats.pendingContacts || 0} Unread)
          </Link>
          <Link to="/admin/manage-admins" className="admin-subnav-item">
            👥 Manage Admins
          </Link>
          <Link to="/" className="admin-subnav-item">
            🌐 Public Portal Home
          </Link>
        </div>
      </nav>

      {/* Main Body */}
      <main className="admin-main">
        {/* Metric Cards Row */}
        <div className="admin-stats-row">
          <div className="admin-stat-card" onClick={() => navigate("/admin/adminapplications")}>
            <div className="stat-label">Total Applications</div>
            <div className="stat-value">{stats.totalApplications || 0}</div>
            <div className="stat-sub">
              <span>{stats.pendingApplications || 0} Pending</span> • <span>{stats.approvedApplications || 0} Approved</span>
            </div>
          </div>

          <div className="admin-stat-card" onClick={() => navigate("/admin/Support")}>
            <div className="stat-label">Public Grievances</div>
            <div className="stat-value">{stats.totalContacts || 0}</div>
            <div className="stat-sub">
              <span>{stats.pendingContacts || 0} Awaiting Reply</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-label">Registered Citizens</div>
            <div className="stat-value">{stats.totalCitizens || 0}</div>
            <div className="stat-sub">Verified Village Accounts</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-label">Certificates Issued</div>
            <div className="stat-value">{reports.certificatesIssued || stats.approvedApplications || 0}</div>
            <div className="stat-sub">Official Digital Records</div>
          </div>
        </div>

        {/* Dashboard 2-Column Grid */}
        <div className="admin-grid-2col">
          {/* Left Column: Recent Activities */}
          <div className="admin-panel-card">
            <div className="panel-card-header">
              <h3>⚡ Recent Application Activity</h3>
              <button
                className="gov-btn gov-btn-outline"
                style={{ fontSize: "0.78rem", padding: "4px 8px" }}
                onClick={() => navigate("/admin/adminapplications")}
              >
                View All →
              </button>
            </div>

            {loading ? (
              <div className="table-loading">
                <div className="gov-spinner"></div>
                <p>Loading activity stream...</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <span className="activity-dot"></span>
                    <div className="activity-details">
                      <strong>{act.action}</strong>
                      <p>
                        Applicant: {act.user} • Village: {act.village}
                      </p>
                    </div>
                    <span className="activity-time">{act.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Scheduled Meetings & Programs */}
          <div className="admin-panel-card">
            <div className="panel-card-header">
              <h3>🗓️ Scheduled Panchayati Raj Meetings</h3>
            </div>
            <div className="meetings-list">
              {upcomingMeetings.map((mtg) => (
                <div key={mtg.id} className="meeting-card-row">
                  <div className="meeting-date-badge">
                    <strong>{mtg.date.split(" ")[0]}</strong>
                    <small>{mtg.date.split(" ")[1]}</small>
                  </div>
                  <div className="meeting-info">
                    <h4>{mtg.title}</h4>
                    <p>🕒 {mtg.time} • 📍 {mtg.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>Administrative Logout</h3>
            <p>Are you sure you want to exit the administrative console?</p>
            <div className="popup-btns">
              <button className="popup-yes" onClick={handleConfirmLogout}>
                Confirm Logout
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

export default AdminDashboard;