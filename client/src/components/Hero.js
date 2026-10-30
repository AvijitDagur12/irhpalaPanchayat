import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="gov-hero-wrapper">
      <div className="gov-hero-container">
        {/* Left Side: Call to Action & Highlights */}
        <div className="gov-hero-left">
          <div className="gov-hero-badge">
            <span className="gov-badge-dot"></span>
            <span>ডিজিটাল সেবা পোর্টাল • Official Citizen Service Portal</span>
          </div>

          <h1 className="gov-hero-title">
            স্বাগতম, ইরপালা গ্রাম পঞ্চায়েত সেবা পোর্টালে
          </h1>

          <p className="gov-hero-bengali-desc">
            ঘরে বসেই অনলাইনে আয় সনদপত্র, স্থায়ী বাসিন্দার সার্টিফিকেট আবেদন করুন এবং সরকারি পরিষেবা উপভোগ করুন।
          </p>

          <p className="gov-hero-english-desc">
            Empowering citizens through transparent, accountable, and accessible digital governance and streamlined public service delivery.
          </p>

          {/* Official Administrative Portal Entry */}
          <div className="gov-hero-actions">
            <button
              className="gov-hero-primary-btn"
              onClick={() => navigate("/admin")}
              title="Official Administrative Department Portals"
            >
              🏛️ প্রশাসনিক প্যানেল / Admin Panel →
            </button>
            <button
              className="gov-hero-secondary-btn"
              onClick={() => navigate("/auth")}
              title="Citizen Dashboard & Verification Portal"
            >
              👤 নাগরিক পোর্টাল / Citizen Portal
            </button>
          </div>

          {/* Citizen Verification Quick Box */}
          <div className="gov-hero-features">
            <div className="gov-feature-chip">
              <span className="chip-icon">⚡</span>
              <span>Online Application</span>
            </div>
            <div className="gov-feature-chip">
              <span className="chip-icon">🛡️</span>
              <span>Official Verification</span>
            </div>
            <div className="gov-feature-chip">
              <span className="chip-icon">📑</span>
              <span>Direct PDF Download</span>
            </div>
          </div>
        </div>

        {/* Right Side: Official Notice Board & Announcements */}
        <div className="gov-hero-right">
          <div className="gov-notice-board">
            <div className="gov-notice-header">
              <div className="notice-header-left">
                <span className="notice-icon">📢</span>
                <h3>বিজ্ঞপ্তি ও নোটিশ বোর্ড (Notice Board)</h3>
              </div>
              <span className="gov-notice-date">{formattedDate}</span>
            </div>

            <div className="gov-notice-list">
              <div className="gov-notice-item">
                <div className="notice-meta">
                  <span className="notice-tag scheme">স্কিম / Scheme</span>
                  <span className="notice-time">Latest</span>
                </div>
                <h4>কৃষক বন্ধু ও পিএম কিষাণ সহায়তা</h4>
                <p>গ্রাম পঞ্চায়েতের যোগ্য কৃষক পরিবারের তালিকা ও ব্যাংক অ্যাকাউন্ট যাচাই প্রক্রিয়া চলমান রয়েছে।</p>
              </div>

              <div className="gov-notice-item">
                <div className="notice-meta">
                  <span className="notice-tag cert">সনদপত্র / Certificate</span>
                  <span className="notice-time">Active</span>
                </div>
                <h4>অনলাইন আয় ও বাসস্থান সনদপত্র</h4>
                <p>আবেদন করার পর প্রাপ্ত টিকিট নম্বর (Ticket ID) দিয়ে সহজেই আবেদনের স্থিতি জেনে নিন ও ডাউনলোড করুন।</p>
              </div>

              <div className="gov-notice-item">
                <div className="notice-meta">
                  <span className="notice-tag meeting">সভা / Meeting</span>
                  <span className="notice-time">Scheduled</span>
                </div>
                <h4>মাসিক গ্রাম সভা ও উন্নয়ন পর্যালোচনা</h4>
                <p>পঞ্চায়েত সভাগৃহে পরবর্তী সাধারণ সভা সকাল ১১:০০ টায় অনুষ্ঠিত হবে। সকল গ্রামবাসী আমন্ত্রিত।</p>
              </div>
            </div>

            <div className="gov-notice-footer">
              <span>জরুরি হেল্পলাইন: 03225-244100</span>
              <button
                className="gov-notice-more-btn"
                onClick={() => navigate("/contact")}
              >
                যোগাযোগ করুন →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;