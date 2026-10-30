// client/src/admin/ControlDashboard.js
// Control Officer dashboard — list all admins, edit any of them.
// Requires control_token in localStorage. Redirects to /control-officer if missing.

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { getAssetUrl } from "../services/api";
import "./ControlOfficer.css";

const ROLE_LABELS = {
  bdo: "BDO Admin",
  member: "Elected Member",
  elected_member: "Elected Member",
  admin: "System Admin",
  secretary: "Panchayat Secretary",
  support: "Grievance Officer",
  control_officer: "Control Officer",
};

const ControlDashboard = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const token = localStorage.getItem("control_token");
  const officer = (() => {
    try {
      return JSON.parse(localStorage.getItem("control_officer") || "null");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchAdmins = useCallback(async () => {
    if (!token) {
      navigate("/control-officer", { replace: true });
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/control/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setAdmins(res.data.admins || []);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      if (err.message?.toLowerCase().includes("expired") || err.message?.includes("401")) {
        localStorage.removeItem("control_token");
        localStorage.removeItem("control_officer");
        navigate("/control-officer", { replace: true });
        return;
      }
      setError(err.message || "Failed to load administrative accounts.");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleLogout = () => {
    localStorage.removeItem("control_token");
    localStorage.removeItem("control_officer");
    navigate("/control-officer", { replace: true });
  };

  const filtered = admins.filter((a) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.role?.toLowerCase().includes(q) ||
      a.designation?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="control-dashboard">
      <header className={`control-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="control-nav-left">
          <span className="control-nav-icon">🔐</span>
          <div>
            <h1>System Control Officer Console</h1>
            <p>Irhpala Gram Panchayat • Administrative Master Directory</p>
          </div>
        </div>

        <div className="control-nav-right">
          {officer && (
            <div className="control-officer-badge">
              <strong>{officer.name}</strong>
              <small>{officer.designation || "Control Officer"}</small>
            </div>
          )}
          <button className="gov-btn control-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="control-page-heading">
        <h2>Administrative Accounts</h2>
        <p>
          Manage official identity, role, credentials and access for every administrative account.
          Only the Control Officer can edit these records.
        </p>
      </div>

      <div className="control-toolbar">
        <input
          type="text"
          className="control-search"
          placeholder="🔍 Search by name, email, role or designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="gov-btn gov-btn-outline" onClick={fetchAdmins}>
          🔄 Refresh
        </button>
      </div>

      {error && <div className="gov-alert gov-alert-error">{error}</div>}

      {loading ? (
        <div className="control-loading">
          <div className="gov-spinner"></div>
          <p>Loading administrative accounts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="control-empty">No administrative accounts match your search.</div>
      ) : (
        <div className="control-table-wrapper">
          <table className="control-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id}>
                  <td>
                    {a.photo ? (
                      <img
                        src={getAssetUrl(a.photo)}
                        alt={a.name}
                        className="control-avatar"
                      />
                    ) : (
                      <div className="control-avatar placeholder">👤</div>
                    )}
                  </td>
                  <td>
                    <strong>{a.name}</strong>
                  </td>
                  <td>{a.email}</td>
                  <td>
                    <span className={`control-role-badge role-${a.role}`}>
                      {ROLE_LABELS[a.role] || a.role}
                    </span>
                  </td>
                  <td>{a.designation || "—"}</td>
                  <td>
                    <span
                      className={`control-status-badge ${
                        a.isActive ? "active" : "inactive"
                      }`}
                    >
                      {a.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/control-officer/edit/${a._id}`}
                      className="gov-btn gov-btn-primary control-edit-btn"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ControlDashboard;