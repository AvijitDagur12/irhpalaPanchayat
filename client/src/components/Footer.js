import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {

  return (
    <footer className="gov-footer">
      <div className="gov-footer-top">
        <div className="gov-footer-container">
          {/* Identity Column */}
          <div className="gov-footer-col">
            <div className="gov-footer-brand">
              <img
                src="https://iconape.com/wp-content/files/bt/257232/svg/257232.svg"
                alt="Government Emblem"
                className="gov-footer-emblem"
              />
              <div>
                <h3>ইরপালা গ্রাম পঞ্চায়েত</h3>
                <p className="gov-footer-sub">Irhpala Gram Panchayat • Ghatal</p>
                <p className="gov-footer-dept">Department of Panchayats & Rural Development, Govt. of West Bengal</p>
              </div>
            </div>
            <p className="gov-footer-desc">
              Dedicated to empowering rural citizens through transparent digital governance,
              rapid certificate issuance, and accessible community development services.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="gov-footer-col">
            <h4>নাগরিক পরিষেবা / Citizen Services</h4>
            <ul className="gov-footer-links">
              <li><Link to="/certificate-application">Apply for Income Certificate (সনদপত্র)</Link></li>
              <li><Link to="/download-certificate">Download Issued Certificate</Link></li>
              <li><Link to="/auth">Citizen Portal Login / Register</Link></li>
              <li><Link to="/contact">Public Grievance & Issue Redressal</Link></li>
              <li><Link to="/#services">All Panchayat Schemes & Services</Link></li>
            </ul>
          </div>

          {/* Administrative Portals */}
          <div className="gov-footer-col">
            <h4>প্রশাসনিক পোর্টাল / Administration</h4>
            <ul className="gov-footer-links">
              <li><Link to="/admin">🏛️ প্রশাসনিক কন্ট্রোল হাব (Admin Panel Hub)</Link></li>
              <li><Link to="/admin/certificates">📜 Elected Member Certificate Desk</Link></li>
              <li><Link to="/psc">📋 Panchayat Secretary (PSC) Portal</Link></li>
              <li><Link to="/admin/Support">📢 Public Grievance Redressal Desk</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="gov-footer-col">
            <h4>যোগাযোগ / Office Contact</h4>
            <div className="gov-footer-contact">
              <p>📍 Irhpala Gram Panchayat Office, Ghatal, Paschim Medinipur, WB - 721212</p>
              <p>📞 Office Helpdesk: 03225-244100 / +91 9876543210</p>
              <p>✉️ Official Email: irhpala.gp@wb.gov.in</p>
              <p>🕒 Working Hours: Mon - Fri: 10:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="gov-footer-bottom">
        <div className="gov-footer-container gov-footer-bottom-flex">
          <p>© {new Date().getFullYear()} Irhpala Gram Panchayat. Official Digital Service Portal. All Rights Reserved.</p>
          <div className="gov-footer-credits">
            <span>Portal Designed & Developed for Irhpala Gram Panchayat</span>
            <span className="gov-footer-dot">•</span>
            <span>Digital Panchayat Platform 2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
