import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CertificateApplication.css";

const CertificateApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "আয় সংক্রান্ত সনদপত্র",
    applicantName: "",
    fatherName: "",
    village: "",
    postOffice: "",
    policeStation: "ঘাটাল",
    district: "পশ্চিম মেদিনীপুর",
    monthlyIncome: "",
    incomeInWords: "",
    gramPanchayat: "ইরপালা গ্রাম পঞ্চায়েত",
    block: "ঘাটাল",
    certificateType: "আয় সংক্রান্ত সনদপত্র",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [certificateId, setCertificateId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const convertToBengaliWords = (amount) => {
    if (!amount) return "";
    return `${amount} টাকা`;
  };

  const handleIncomeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      monthlyIncome: value,
      incomeInWords: convertToBengaliWords(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/certificate", formData);

      if (response.data && response.data.success) {
        setCertificateId(response.data.data.ticketId);
        setShowPopup(true);
        setResponseMsg("সনদপত্র আবেদন সফলভাবে গৃহীত হয়েছে! ✅");

        setFormData({
          subject: "আয় সংক্রান্ত সনদপত্র",
          applicantName: "",
          fatherName: "",
          village: "",
          postOffice: "",
          policeStation: "ঘাটাল",
          district: "পশ্চিম মেদিনীপুর",
          monthlyIncome: "",
          incomeInWords: "",
          gramPanchayat: "ইরপালা গ্রাম পঞ্চায়েত",
          block: "ঘাটাল",
          certificateType: "আয় সংক্রান্ত সনদপত্র",
        });
      }
    } catch (error) {
      setResponseMsg("আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন। ❌");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMsg(""), 5000);
    }
  };

  return (
    <div className="certificate-section">
      <div className="certificate-container">
        {/* Header */}
        <div className="gov-section-header">
          <div className="gov-section-badge">
            <span>📜 অনলাইন সেবা • Online Certificate Application</span>
          </div>
          <h2>আয় সংক্রান্ত প্রশংসাপত্র / সনদপত্র আবেদন</h2>
          <p className="gov-section-subtitle">
            ইরপালা গ্রাম পঞ্চায়েত • ঘাটাল, পশ্চিম মেদিনীপুর | সঠিক তথ্য প্রদান করে আবেদন জমা দিন
          </p>
        </div>

        <div className="cert-app-card">
          <div className="cert-app-card-header">
            <h3>নাগরিক বিবরণ ফরম (Applicant Declaration Form)</h3>
            <Link to="/" className="gov-btn gov-btn-outline" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
              ← Return Home
            </Link>
          </div>

          {responseMsg && (
            <div
              className={`gov-alert ${
                responseMsg.includes("✅") ? "gov-alert-success" : "gov-alert-error"
              }`}
            >
              {responseMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="gov-form">
            <div className="gov-form-grid">
              <div className="gov-form-group">
                <label>আবেদনকারীর নাম (Applicant Name) *</label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleChange}
                  placeholder="উদাঃ রমেশ চন্দ্র দাস"
                  required
                />
              </div>

              <div className="gov-form-group">
                <label>পিতা / স্বামীর নাম (Father's / Husband's Name) *</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="অভিভাবকের নাম"
                  required
                />
              </div>
            </div>

            <div className="gov-form-grid">
              <div className="gov-form-group">
                <label>গ্রামের নাম (Village Name) *</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="উদাঃ ইরপালা"
                  required
                />
              </div>

              <div className="gov-form-group">
                <label>পোস্ট অফিস (Post Office) *</label>
                <input
                  type="text"
                  name="postOffice"
                  value={formData.postOffice}
                  onChange={handleChange}
                  placeholder="উদাঃ ইরপালা"
                  required
                />
              </div>
            </div>

            <div className="gov-form-grid">
              <div className="gov-form-group">
                <label>থানা (Police Station)</label>
                <input
                  type="text"
                  name="policeStation"
                  value={formData.policeStation}
                  onChange={handleChange}
                  readOnly
                  className="readonly"
                />
              </div>

              <div className="gov-form-group">
                <label>জেলা (District)</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            <div className="gov-form-grid">
              <div className="gov-form-group">
                <label>মাসিক পারিবারিক আয় (Monthly Income in ₹) *</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleIncomeChange}
                  placeholder="উদাঃ 8000"
                  required
                />
              </div>

              <div className="gov-form-group">
                <label>সনদপত্রের ধরণ (Certificate Type)</label>
                <input
                  type="text"
                  name="certificateType"
                  value={formData.certificateType}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            <div className="gov-form-group">
              <label>আবেদনের উদ্দেশ্য / বিষয় (Subject)</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="উদাঃ স্কলারশিপ / উচ্চশিক্ষা / সরকারি স্কিম"
              />
            </div>

            <div className="declaration-box">
              <label>
                <input type="checkbox" required style={{ width: "auto", marginRight: "8px" }} />
                আমি প্রত্যয়ন করছি যে উপরে প্রদত্ত সমস্ত বিবরণ সত্য ও সঠিক। কোনো অসত্য তথ্য প্রমাণিত হলে আবেদন বাতিল বলিয়া গণ্য হইবে।
              </label>
            </div>

            <button
              type="submit"
              className="gov-btn gov-btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "12px", marginTop: "12px" }}
            >
              {loading ? "আবেদন জমা হচ্ছে..." : "সনদপত্রের আবেদন জমা দিন (Submit Application) →"}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showPopup && (
        <div className="gov-modal-overlay">
          <div className="gov-modal-card">
            <div className="gov-modal-icon">✅</div>
            <h3>আবেদন সফলভাবে গৃহীত হয়েছে!</h3>
            <p className="gov-modal-sub">
              আপনার সনদপত্র আবেদনপত্রটি ইরপালা গ্রাম পঞ্চায়েতের যাচাই তালিকায় যুক্ত হয়েছে।
            </p>
            <div className="gov-ticket-box">
              <span>ট্র্যাকিং টিকিট নম্বর (Ticket ID):</span>
              <strong>{certificateId}</strong>
            </div>
            <p className="gov-modal-hint">
              অনুমোদনের পর এই টিকিট নম্বরটি ব্যবহার করে সরাসরি পিডিএফ সার্টিফিকেট ডাউনলোড করতে পারবেন।
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                className="gov-btn gov-btn-primary"
                onClick={() => navigate("/download-certificate")}
              >
                সনদপত্র ডাউনলোড পেজে যান →
              </button>
              <button
                className="gov-btn gov-btn-outline"
                onClick={() => setShowPopup(false)}
              >
                ঠিক আছে (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateApplication;