import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PopupModal.css";

const PopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show once per session so it doesn't repeatedly annoy the user
    const hasSeenNotice = sessionStorage.getItem("hasSeenPortalWelcomeNotice");
    if (!hasSeenNotice) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenPortalWelcomeNotice", "true");
  };

  const handleAction = (path) => {
    handleClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div className="gov-welcome-overlay" role="dialog" aria-modal="true">
      <div className="gov-welcome-box">
        <button
          className="gov-welcome-close"
          onClick={handleClose}
          aria-label="Close Notice"
        >
          ✕
        </button>

        <div className="gov-welcome-header">
          <div className="gov-welcome-emblem">🏛️</div>
          <div>
            <h3>ইরপালা গ্রাম পঞ্চায়েত ডিজিটাল সেবা পোর্টাল</h3>
            <span className="gov-welcome-sub">
              Official Digital Panchayat Portal • Ghatal, Paschim Medinipur
            </span>
          </div>
        </div>

        <div className="gov-welcome-body">
          <p className="gov-welcome-greeting">
            <strong>মাননীয় নাগরিকবৃন্দ,</strong>
          </p>
          <p>
            ইরপালা গ্রাম পঞ্চায়েতের সমস্ত প্রশাসনিক সেবা এখন আপনার হাতের মুঠোয়। এই ডিজিটাল পোর্টালের মাধ্যমে আপনি ঘরে বসেই আয় সংক্রান্ত সনদপত্র আবেদন করতে পারবেন, পূর্ববর্তী সার্টিফিকেটের স্থিতি যাচাই করে ডিজিটাল কপি ডাউনলোড করতে পারবেন এবং যে কোনো সমস্যা বা অভিযোগ সরাসরি পঞ্চায়েতে জানাতে পারবেন।
          </p>
          <div className="gov-welcome-highlights">
            <div className="gov-welcome-chip">⚡ সরাসরি অনলাইন সার্টিফিকেট আবেদন</div>
            <div className="gov-welcome-chip">🔍 ট্র্যাকিং নম্বর সহ স্থিতি যাচাই</div>
            <div className="gov-welcome-chip">📞 স্বচ্ছ জনঅভিযোগ নিষ্পত্তি সেল</div>
          </div>
        </div>

        <div className="gov-welcome-footer">
          <button
            className="gov-btn gov-btn-primary"
            onClick={() => handleAction("/certificate-application")}
          >
            📄 সনদপত্র আবেদন / Apply Certificate
          </button>
          <button
            className="gov-btn gov-btn-outline"
            onClick={handleClose}
          >
            পোর্টাল পরিদর্শন করুন / Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;