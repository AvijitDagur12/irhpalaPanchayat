import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children, allowedRoles }) => {
  const { admin } = useAuth();
  const location = useLocation();

  if (!admin) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
    const isMember = admin.role === "member" || admin.role === "elected_member";
    const isSecretary = admin.role === "secretary";
    const isSupport = admin.role === "support";

    return (
      <div style={{ padding: "60px 20px", textAlign: "center", maxWidth: "600px", margin: "40px auto", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🛡️</div>
        <h2 style={{ color: "#0f3b6c", marginBottom: "10px" }}>Authorized Role Restriction</h2>
        <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: "20px" }}>
          Your authorized administrative role is <strong>{admin.role?.toUpperCase()}</strong> ({admin.designation || "Panchayat Official"}).
          This console requires <strong>{allowedRoles.map((r) => r.toUpperCase()).join(" or ")}</strong> privileges.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          {isMember && (
            <a
              href="/admin/certificates"
              className="gov-btn gov-btn-primary"
              style={{ padding: "10px 18px", textDecoration: "none" }}
            >
              Go to Member Certificate Desk →
            </a>
          )}
          {isSecretary && (
            <a
              href="/psc"
              className="gov-btn gov-btn-primary"
              style={{ padding: "10px 18px", textDecoration: "none" }}
            >
              Go to Panchayat Secretary Desk →
            </a>
          )}
          {isSupport && (
            <a
              href="/admin/Support"
              className="gov-btn gov-btn-primary"
              style={{ padding: "10px 18px", textDecoration: "none" }}
            >
              Go to Grievance Redressal Desk →
            </a>
          )}
          <a
            href="/admin"
            className="gov-btn gov-btn-outline"
            style={{ padding: "10px 18px", textDecoration: "none" }}
          >
            ← Admin Department Hub
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
