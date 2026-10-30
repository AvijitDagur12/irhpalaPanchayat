import React from "react";
import { Link } from "react-router-dom";
import "./Topbar.css";

const Topbar = () => {
  return (
    <div className="gov-topbar">
      <div className="gov-topbar-inner">
        <div className="gov-topbar-left">
          <span className="gov-flag-icon">🇮🇳</span>
          <span className="gov-authority-text">
            পশ্চিমবঙ্গ সরকার • Government of West Bengal
          </span>
          <span className="gov-topbar-divider">|</span>
          <span className="gov-dept-text">
            Irhpala Gram Panchayat, Ghatal
          </span>
        </div>

        <div className="gov-topbar-right">
          <div className="gov-topbar-links">
            <Link to="/admin" className="gov-topbar-link" title="Official Administration Portal">
              <span className="gov-icon">🏛️</span>  Admin Panel
            </Link>
            <Link to="/psc" className="gov-topbar-link" title="Gram Panchayat Secretary Console">
              <span className="gov-icon">📋</span>  Secretary Desk
            </Link>
            <Link to="/contact" className="gov-topbar-link" title="Public Grievance Redressal">
              <span className="gov-icon">📞</span> অভিযোগ সেল / Grievance Helpline
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;