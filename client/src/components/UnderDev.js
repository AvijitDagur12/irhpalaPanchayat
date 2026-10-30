import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UnderDev.css";

const UnderDev = () => {
  const navigate = useNavigate();
  const pageName = localStorage.getItem("devPage") || "Digital Service";

  return (
    <div className="gov-advisory-wrapper">
      <div className="gov-advisory-card">
        <div className="gov-advisory-header">
          <span className="gov-advisory-emblem">🏛️</span>
          <h2>ইরপালা গ্রাম পঞ্চায়েত ডিজিটাল সেবা</h2>
          <span className="gov-advisory-sub">Government of West Bengal • Public Service Portal</span>
        </div>

        <div className="gov-advisory-body">
          <div className="gov-advisory-icon-wrap">
            <span className="advisory-icon">📋</span>
          </div>
          <h3>বিভাগীয় বিজ্ঞপ্তি: {pageName}</h3>
          <p className="advisory-bengali">
            মাননীয় নাগরিকবৃন্দ, <strong>"{pageName}"</strong> পরিষেবাটি ডিজিটাল পঞ্চায়েত আধুনিকীকরণ প্রকল্পের আওতায় সংযুক্ত করা হচ্ছে। সরকারি নির্দেশিকা ও ডেটাবেস যাচাইকরণ সম্পন্ন হওয়া মাত্রই পরিষেবাটি উন্মুক্ত করা হইবে।
          </p>
          <p className="advisory-english">
            This module ({pageName}) is currently being integrated as part of the Digital Panchayat expansion initiative. Verified digital processing will be accessible shortly.
          </p>

          <div className="gov-advisory-actions">
            <button onClick={() => navigate("/")} className="gov-btn gov-btn-primary">
              🏠 প্রধান পাতায় ফিরে যান / Go to Home
            </button>
            <Link to="/contact" className="gov-btn gov-btn-outline">
              📞 সহায়তা সেল / Contact Helpdesk
            </Link>
            <button onClick={() => navigate(-1)} className="gov-btn gov-btn-outline">
              🔙 পূর্ববর্তী পৃষ্ঠা / Go Back
            </button>
          </div>
        </div>

        <div className="gov-advisory-footer">
          <small>
            জরুরি পরিষেবার জন্য পঞ্চায়েত কার্যালয়ে যোগাযোগ করুন: 03225-244100 (সোম - শুক্র, ১০ টা - ৫ টা)
          </small>
        </div>
      </div>
    </div>
  );
};

export default UnderDev;