import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HeaderNav.css";

const HeaderNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="gov-header-nav" role="banner">
      <div className="gov-header-container">
        {/* Left: Emblem & Panchayat Title */}
        <div className="gov-header-brand">
          <Link to="/" onClick={closeMenu} className="gov-brand-link" title="Irhpala Gram Panchayat Home">
            <img
              src="https://iconape.com/wp-content/files/bt/257232/svg/257232.svg"
              alt="National Emblem of India"
              className="gov-header-logo"
            />
            <div className="gov-brand-titles">
              <span className="gov-brand-bengali">ইরপালা গ্রাম পঞ্চায়েত</span>
              <span className="gov-brand-english">IRHPALA GRAM PANCHAYAT</span>
              <span className="gov-brand-sub">Ghatal • Paschim Medinipur • West Bengal</span>
            </div>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="gov-mobile-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Center: Main Navigation Links */}
        <nav className={`gov-nav-menu ${isMenuOpen ? "active" : ""}`} role="navigation" aria-label="Main Navigation">
          <Link
            to="/"
            className={`gov-nav-item ${isActive("/") ? "active" : ""}`}
            onClick={closeMenu}
          >
             Home
          </Link>

          <a
            href="/#about"
            className="gov-nav-item"
            onClick={closeMenu}
          >
            পরিচিতি / About
          </a>

          <a
            href="/#services"
            className="gov-nav-item"
            onClick={closeMenu}
          >
            পরিষেবা / Services
          </a>

          {/* Services Dropdown */}
          <div
            className={`gov-nav-dropdown ${dropdownOpen ? "open" : ""}`}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`gov-dropdown-btn ${
                isActive("/certificate-application") ||
                isActive("/download-certificate") ||
                isActive("/apply-certificate")
                  ? "active"
                  : ""
              }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              সনদপত্র সেবা / Certificates <span className="gov-caret">▾</span>
            </button>
            <div className={`gov-dropdown-menu ${dropdownOpen ? "show" : ""}`}>
              <Link to="/apply-certificate" onClick={closeMenu}>
                📜 পঞ্চায়েত সনদপত্র আবেদন (Gram Panchayat Application)
              </Link>
              <Link to="/certificate-application" onClick={closeMenu}>
                📄 সদস্য আয় সনদপত্র (Elected Member Income Cert)
              </Link>
              <Link to="/download-certificate" onClick={closeMenu}>
                ⬇️ সনদপত্র স্থিতি ও ডাউনলোড (Track & Download Cert)
              </Link>
            </div>
          </div>

          <Link
            to="/contact"
            className={`gov-nav-item ${isActive("/contact") ? "active" : ""}`}
            onClick={closeMenu}
          >
            অভিযোগ সেল / Grievance
          </Link>

          {/* Administrative Portal Link */}
          <Link
            to="/admin"
            className={`gov-nav-item gov-admin-nav-item ${
              isActive("/admin") || isActive("/psc") ? "active" : ""
            }`}
            onClick={closeMenu}
            title="Panchayat Administrative Portals & Department Selection"
          >
            🏛️ প্রশাসনিক প্যানেল / Admin Panel
          </Link>

          {/* Right Action: Auth Buttons */}
          <div className="gov-nav-action" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {admin && (
              <button
                className="gov-login-btn admin-badge-btn"
                style={{ background: "#0284c7", borderColor: "#38bdf8" }}
                onClick={() => {
                  closeMenu();
                  if (admin.role === "member" || admin.role === "elected_member") {
                    navigate("/admin/certificates");
                  } else if (admin.role === "secretary") {
                    navigate("/psc");
                  } else if (admin.role === "support") {
                    navigate("/admin/Support");
                  } else {
                    navigate("/admin/dashboard");
                  }
                }}
                title={`Logged in as ${admin.name} (${admin.role})`}
              >
                ⚙️ {admin.role === "secretary" ? "PSC Desk" : admin.role === "member" ? "Member Desk" : admin.role === "support" ? "Grievance Desk" : "Admin Desk"}
              </button>
            )}

            {user ? (
              <button
                className="gov-login-btn logged-in"
                onClick={() => {
                  closeMenu();
                  navigate("/dashboard");
                }}
              >
                👤 {user.name?.split(" ")[0] || "Citizen"} Dashboard
              </button>
            ) : (
              <Link to="/auth" onClick={closeMenu}>
                <button className="gov-login-btn">
                  নাগরিক লগইন / Citizen Portal
                </button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderNav;