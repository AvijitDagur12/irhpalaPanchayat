import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { API_BASE_URL } from "../services/api";
import "./CertificateLogin.css";

const CertificateLogin = () => {
  const [ticketId, setTicketId] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [expectedSum, setExpectedSum] = useState(0);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const sum = num1 + num2;
    setCaptcha(`${num1} + ${num2} = ?`);
    setExpectedSum(sum);
  };

  const refreshCaptcha = () => {
    generateCaptcha();
    setCaptchaValue("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(captchaValue, 10) !== expectedSum) {
      setError("Invalid security captcha calculation. Please try again.");
      refreshCaptcha();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/api/certificate/ticket/${ticketId.trim()}`);

      if (response.data && response.data.success) {
        setUserData(response.data.data);
        setShowCertificate(true);
      } else {
        setError("Invalid Ticket ID. Please verify the ID received during submission.");
      }
    } catch (err) {
      setError(err.message || "No certificate found with this Ticket ID.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    if (!userData || !userData._id) return;
    window.open(`${API_BASE_URL}/api/download-certificate-pdf/${userData._id}`, "_blank");
  };

  return (
    <div className="certificate-login-section">
      <div className="certificate-login-container">
        <div className="gov-section-header" style={{ marginBottom: "28px" }}>
          <div className="gov-section-badge">
            <span>⬇️ সনদপত্র স্থিতি ও ডাউনলোড • Certificate Verification</span>
          </div>
          <h2>সনদপত্র ট্র্যাকিং ও সরাসরি ডাউনলোড</h2>
          <p className="gov-section-subtitle">
            আবেদন করার পর প্রাপ্ত টিকিট নম্বর (Ticket ID) প্রদান করে আপনার সনদপত্রের স্থিতি জানুন ও অনুমোদিত পিডিএফ কপি ডাউনলোড করুন।
          </p>
        </div>

        {!showCertificate ? (
          <div className="login-form-wrapper">
            <form onSubmit={handleSubmit} className="gov-form">
              {error && (
                <div className="gov-alert gov-alert-error" style={{ marginBottom: "16px" }}>
                  {error}
                </div>
              )}

              <div className="gov-form-group">
                <label>টিকিট নম্বর (Ticket ID / Reference ID) *</label>
                <input
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="উদাঃ TKT-XXXXXX"
                  required
                />
                <small className="gov-input-hint">
                  আবেদনের সময় প্রদত্ত অনন্য টিকিট নম্বর লিখুন (e.g. TKT-ABC12345)
                </small>
              </div>

              <div className="gov-form-group captcha-group">
                <label>নিরাপত্তা যাচাই (Security Verification) *</label>
                <div className="captcha-box" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "6px 0" }}>
                  <span className="captcha-text" style={{ padding: "8px 16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "4px", fontWeight: "700", color: "#0f3b6c" }}>
                    {captcha}
                  </span>
                  <button type="button" className="gov-btn gov-btn-outline" onClick={refreshCaptcha} style={{ padding: "8px 12px" }}>
                    🔄
                  </button>
                </div>
                <input
                  type="number"
                  value={captchaValue}
                  onChange={(e) => setCaptchaValue(e.target.value)}
                  placeholder="যোগফল লিখুন (Enter the sum)"
                  required
                />
              </div>

              <button
                type="submit"
                className="gov-btn gov-btn-primary"
                disabled={loading}
                style={{ width: "100%", padding: "12px", marginTop: "10px" }}
              >
                {loading ? "যাচাই করা হচ্ছে..." : "সনদপত্রের স্থিতি যাচাই করুন (Track Status) →"}
              </button>
            </form>

            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <Link to="/" style={{ color: "#0f3b6c", fontSize: "0.85rem" }}>
                ← Return to Panchayat Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="certificate-preview-card">
            <div className="preview-status-header">
              <span className={`status-badge ${userData.status?.toLowerCase()}`}>
                Status: {userData.status}
              </span>
              <button
                className="gov-btn gov-btn-outline"
                style={{ padding: "6px 12px", fontSize: "0.825rem" }}
                onClick={() => {
                  setShowCertificate(false);
                  setTicketId("");
                  refreshCaptcha();
                }}
              >
                ← অন্য টিকিট অনুসন্ধান (Track Another)
              </button>
            </div>

            <div className="cert-preview-body">
              <h3>{userData.subject || userData.certificateType || "আয় সংক্রান্ত সনদপত্র"}</h3>
              <div className="preview-meta-grid">
                <div>
                  <strong>আবেদনকারীর নাম:</strong> {userData.applicantName}
                </div>
                <div>
                  <strong>পিতা / অভিভাবক:</strong> {userData.fatherName}
                </div>
                <div>
                  <strong>গ্রাম:</strong> {userData.village}
                </div>
                <div>
                  <strong>পোস্ট অফিস:</strong> {userData.postOffice}
                </div>
                <div>
                  <strong>মাসিক আয়:</strong> ₹{userData.monthlyIncome}/-
                </div>
                <div>
                  <strong>আবেদনের তারিখ:</strong> {new Date(userData.submittedAt || userData.createdAt).toLocaleDateString("en-IN")}
                </div>
              </div>

              {userData.status === "Approved" ? (
                <div className="approved-download-box">
                  <div className="download-notice">
                    <span>✅</span>
                    <div>
                      <strong>সনদপত্র অনুমোদিত হয়েছে!</strong>
                      <p>আপনার ডিজিটাল প্রশংসাপত্রটি প্রস্তুত। নিচের বোতামে ক্লিক করে অফিসিয়াল কপি ডাউনলোড করুন।</p>
                    </div>
                  </div>
                  <button
                    className="gov-btn gov-btn-secondary"
                    onClick={downloadCertificate}
                    style={{ padding: "12px 24px", fontSize: "1rem" }}
                  >
                    ⬇️ ডাউনলোড করুন (Download Official PDF)
                  </button>
                </div>
              ) : userData.status === "Rejected" ? (
                <div className="rejected-download-box">
                  <p>⚠️ আপনার এই আবেদনটি গ্রাম পঞ্চায়েত কর্তৃপক্ষ কর্তৃক বাতিল করা হয়েছে।</p>
                  {userData.remarks && <p>মন্তব্য: {userData.remarks}</p>}
                </div>
              ) : (
                <div className="pending-download-box">
                  <p>⏳ আপনার আবেদনটি বর্তমানে যাচাই প্রক্রিয়ার অধীনে রয়েছে। অনুমোদন সম্পন্ন হলে এই পেজ থেকেই সার্টিফিকেট ডাউনলোড করতে পারবেন।</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateLogin;