import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AdminList.css";

const AdminList = () => {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/all");
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error("Failed to load admins:", err);
      setError(err.message || "Failed to load administrative accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!admin) {
      navigate("/admin");
    } else {
      fetchAdmins();
    }
  }, [admin, navigate, fetchAdmins]);

  const filteredAdmins = admins.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.phone?.includes(q) ||
      a.role?.toLowerCase().includes(q) ||
      a.designation?.toLowerCase().includes(q)
    );
  });

  const getRoleDisplayName = (role) => {
    if (role === "bdo") return "BDO Admin";
    if (role === "member" || role === "elected_member" || role === "admin") return "Panchayat Elected Member";
    return role?.toUpperCase();
  };

  return (
    <div className="admin-list-page">
      {/* Header */}
      <div className="admin-list-header">
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
            <h1>Administrative Officers Directory</h1>
            <p>Irhpala Gram Panchayat • Manage Official Accounts & Roles</p>
          </div>
        </div>
        <div className="header-right">
          <Link
            to="/admin/dashboard"
            className="gov-btn gov-btn-outline"
            style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}
          >
            ← Back to Overview
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-list-toolbar">
        <div className="toolbar-info">
          <strong>{filteredAdmins.length}</strong> administrative officer account
          {filteredAdmins.length !== 1 ? "s" : ""}
        </div>
        <div className="search-group">
          <input
            type="text"
            placeholder="🔍 Search by name, email, phone, role, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="gov-btn gov-btn-outline btn-sm" onClick={fetchAdmins}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="gov-alert gov-alert-error">{error}</div>}

      {/* Table */}
      <div className="admin-list-table-container">
        {loading ? (
          <div className="table-loading" style={{ padding: "40px", textAlign: "center" }}>
            <div className="gov-spinner" style={{ margin: "0 auto 10px" }}></div>
            <p>Loading administrative accounts...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-list-table">
              <thead>
                <tr>
                  <th>Officer Name</th>
                  <th>Official Email</th>
                  <th>Phone</th>
                  <th>DOB / Age</th>
                  <th>Role</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((a) => (
                    <tr key={a._id}>
                      <td>
                        <div className="officer-cell">
                          <div className="officer-avatar">
                            {a.name?.charAt(0).toUpperCase()}
                          </div>
                          <strong>{a.name}</strong>
                        </div>
                      </td>
                      <td>{a.email}</td>
                      <td>{a.phone || <span style={{ color: "#94a3b8" }}>—</span>}</td>
                      <td>{a.dob || <span style={{ color: "#94a3b8" }}>—</span>}</td>
                      <td>
                        <span className={`role-badge role-${a.role}`}>
                          {getRoleDisplayName(a.role)}
                        </span>
                      </td>
                      <td>{a.designation || "Panchayat Official"}</td>
                      <td>
                        <span className={`status-badge ${a.isActive ? "active" : "inactive"}`}>
                          {a.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/admin/manage-admins/${a._id}`}
                          className="gov-btn gov-btn-primary btn-sm"
                        >
                          ✏️ Edit Profile
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", padding: "30px", color: "#64748b" }}
                    >
                      No administrative accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminList;