import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAuth();

  const getDepartmentPath = (role) => {
    if (role === "member" || role === "elected_member") return "/admin/certificates";
    if (role === "secretary") return "/psc";
    if (role === "support") return "/admin/Support";
    if (role === "control_officer") return "/control-officer/dashboard";
    return "/admin/dashboard";
  };

  const departments = [
    {
      id: "member",
      title: "Elected Member Certificate Desk",
      bengali: "নির্বাচিত সদস্য সনদপত্র বিভাগ",
      role: "Elected Panchayat Pradhan / Member",
      icon: "🏛️",
      accent: "#0284c7",
      desc: "Authorized processing and digital issuance of direct Elected Member Income Certificates (TKT-XXXX).",
      link: "/admin/member-login",
      btnText: "Enter Member Desk →",
      adminName: "Panchayat Elected Member",
      photo: null,
    },
    {
      id: "psc",
      title: "Gram Panchayat / PSC Admin",
      bengali: "গ্রাম পঞ্চায়েত সচিব ও প্রশাসনিক বিভাগ",
      role: "Panchayat Secretary (PSC)",
      icon: "📜",
      accent: "#166534",
      desc: "Statutory verification of Gram Panchayat certificate applications and uploaded Elected Member certificates.",
      link: "/admin/secretary-login",
      btnText: "Enter Secretary Desk →",
      adminName: "Panchayat Secretary",
      photo: null,
    },
    {
      id: "grievance",
      title: "Public Grievance Redressal Cell",
      bengali: "জনঅভিযোগ প্রতিকার ও নিষ্পত্তি সেল",
      role: "Public Grievance Redressal Officer",
      icon: "📢",
      accent: "#d97706",
      desc: "Dedicated monitoring and official redressal desk for public water, road, sanitation, and citizen issues.",
      link: "/admin/support-login",
      btnText: "Enter Grievance Desk →",
      adminName: "Public Grievance Officer",
      photo: null,
    },
    {
      id: "control",
      title: "System Control Officer",
      bengali: "সিস্টেম নিয়ন্ত্রণ কর্মকর্তা",
      role: "Administrative Master Controller",
      icon: "🔐",
      accent: "#1e293b",
      desc: "Restricted master console to manage every administrative account, credentials, roles and photos.",
      link: "/control-officer",
      btnText: "Enter Control Console →",
      adminName: "System Control Officer",
      photo: null,
    },
  ];

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
              <h1 style={{ color: "#ffffff" }}>প্রশাসনিক কন্ট্রোল হাব • Admin Panel</h1>
              <p style={{ color: "#cbd5e1" }}>Irhpala Gram Panchayat • Government of West Bengal</p>
            </div>
          </div>
          <div>
            <Link
              to="/"
              className="gov-btn gov-btn-outline"
              style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)" }}
            >
              ← Public Citizen Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="admin-portal-main">
        {admin && (
          <div className="admin-active-session-card">
            <div className="active-session-content">
              <span className="session-icon">🛡️</span>
              <div>
                <h3>Active Official Session: {admin.name}</h3>
                <p>
                  Authorized Role: <strong>{admin.role?.toUpperCase()}</strong> • Department:{" "}
                  {admin.designation || admin.department || "Panchayat Administration"}
                </p>
              </div>
            </div>
            <div className="active-session-actions">
              <button
                className="gov-btn gov-btn-primary"
                onClick={() => navigate(getDepartmentPath(admin.role))}
              >
                Go to Your Authorized Dashboard →
              </button>
              <button className="gov-btn gov-btn-outline" onClick={logoutAdmin}>
                Sign Out
              </button>
            </div>
          </div>
        )}

        <section className="portal-departments-section">
          <div className="section-title-box">
            <h2>প্রশাসনিক বিভাগ নির্বাচন • Department Portals</h2>
            <p>
              Every administrator operates under strict departmental separation and dedicated
              responsibilities.
            </p>
          </div>

          <div className="portal-departments-grid">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className={`portal-dept-card ${dept.id === "control" ? "control-card" : ""}`}
              >
                <div className="card-top-band" style={{ background: dept.accent }}>
                  <span className="card-gp-label">IRHPALA-GP</span>
                </div>

                <div className="card-identity-row">
                  <div className="card-photo-box">
                    {dept.photo ? (
                      <img src={dept.photo} alt={dept.adminName} />
                    ) : (
                      <div className="card-photo-placeholder">👤</div>
                    )}
                  </div>
                  <div className="card-emblem-box">
                    <img
                      src="https://iconape.com/wp-content/files/bt/257232/svg/257232.svg"
                      alt="Administrative Emblem"
                    />
                  </div>
                </div>

                <div className="card-name-block">
                  <h3 className="card-admin-name">{dept.adminName}</h3>
                  <p className="card-admin-dept">{dept.title}</p>
                  <span className="card-admin-bengali">{dept.bengali}</span>
                </div>

                <div className="dept-role-badge">
                  <span>Role: {dept.role}</span>
                </div>

                <p className="dept-desc">{dept.desc}</p>

                <div className="dept-card-action">
                  <button
                    className="gov-btn gov-btn-primary"
                    style={{
                      background: dept.accent,
                      borderColor: dept.accent,
                      width: "100%",
                    }}
                    onClick={() => navigate(dept.link)}
                  >
                    {dept.btnText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLogin;