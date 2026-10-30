import React, { useState } from "react";
import api from "../services/api";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "complaint",
    message: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("message", formData.message);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await api.post("/api/contact", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const receivedTicket =
          response.data.ticketNumber ||
          response.data.data?.ticketNumber ||
          response.data.data?._id?.slice(-6).toUpperCase();
        setTicketId(receivedTicket);
        setShowPopup(true);
        setResponseMsg("আপনার অভিযোগ সফলভাবে গৃহীত হয়েছে! ✅");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "complaint",
          message: "",
          image: null,
        });
        const fileInput = document.getElementById("imageUpload");
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      setResponseMsg("দাখিল করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন। ❌");
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMsg(""), 5000);
    }
  };

  return (
    <div className="gov-contact-section" id="contact">
      <div className="gov-contact-container">
        {/* Header */}
        <div className="gov-section-header">
          <div className="gov-section-badge">
            <span>📞 নাগরিক অভিযোগ ও যোগাযোগ সেল • Grievance Redressal</span>
          </div>
          <h2>জনঅভিযোগ ও সহায়তা পোর্টাল</h2>
          <p className="gov-section-subtitle">
            গ্রাম পঞ্চায়েতের যে কোনো সমস্যা বা পরিষেবা সংক্রান্ত অনুসন্ধান জানান। প্রতিটি অভিযোগের একটি ট্র্যাকিং টিকিট নম্বর প্রদান করা হবে।
          </p>
        </div>

        <div className="gov-contact-layout">
          {/* Left Side: Official Contact Info */}
          <div className="gov-contact-info-card">
            <h3>📇 যোগাযোগের ঠিকানা ও সময়সূচী</h3>

            <div className="gov-info-list">
              <div className="gov-info-row">
                <span className="gov-row-icon">🏛️</span>
                <div>
                  <strong>অফিসের ঠিকানা:</strong>
                  <p>ইরপালা গ্রাম পঞ্চায়েত কার্যালয়, ঘাটাল, পশ্চিম মেদিনীপুর, পিন - ৭২১২১২</p>
                </div>
              </div>

              <div className="gov-info-row">
                <span className="gov-row-icon">📞</span>
                <div>
                  <strong>টোল-ফ্রি হেল্পলাইন:</strong>
                  <p>03225-244100 / 1800-345-0111 (সোম - শুক্র)</p>
                </div>
              </div>

              <div className="gov-info-row">
                <span className="gov-row-icon">✉️</span>
                <div>
                  <strong>অফিসিয়াল ইমেল:</strong>
                  <p>irhpala.gp@wb.gov.in / helpdesk@panchayat.gov.in</p>
                </div>
              </div>

              <div className="gov-info-row">
                <span className="gov-row-icon">⏰</span>
                <div>
                  <strong>জনগণ দর্শনের সময়:</strong>
                  <p>সকাল ১০:০০ টা হইতে বিকাল ৫:০০ টা (সরকারি ছুটির দিন ব্যতীত)</p>
                </div>
              </div>
            </div>

            <div className="gov-contact-assurance">
              <h4>🛡️ স্বচ্ছতার নিশ্চয়তা</h4>
              <p>
                আমাদের পঞ্চায়েতে প্রতিটি অভিযোগ সরাসরি সচিব ও প্রধানের নজরে যায় এবং সরকারি নিয়ম অনুসারে দ্রুত সমাধানের ব্যবস্থা নেওয়া হয়।
              </p>
            </div>
          </div>

          {/* Right Side: Grievance Submission Form */}
          <div className="gov-contact-form-card">
            <h3>📝 নতুন অভিযোগ / অনুসন্ধান দাখিল করুন</h3>

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
                  <label>আপনার সম্পূর্ণ নাম (Applicant Name) *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="উদাঃ অশোক কুমার দাস"
                    required
                  />
                </div>

                <div className="gov-form-group">
                  <label>মোবাইল নম্বর (Phone Number) *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="১০ সংখ্যার মোবাইল নম্বর"
                    required
                  />
                </div>
              </div>

              <div className="gov-form-grid">
                <div className="gov-form-group">
                  <label>ইমেল ঠিকানা (Email - Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                  />
                </div>

                <div className="gov-form-group">
                  <label>বিষয় / বিভাগের ধরণ (Subject Category) *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="complaint">সাধারণ অভিযোগ (Public Grievance)</option>
                    <option value="water">পানীয় জল ও নলকূপ (Drinking Water Issue)</option>
                    <option value="road">রাস্তাঘাট ও নিকাশী (Road / Drainage Problem)</option>
                    <option value="certificate">সনদপত্র সংক্রান্ত (Certificate Query)</option>
                    <option value="scheme">সরকারি যোজনা ও স্কিম (Scheme Information)</option>
                    <option value="other">অন্যান্য (Other Issues)</option>
                  </select>
                </div>
              </div>

              <div className="gov-form-group">
                <label>অভিযোগের বিস্তারিত বিবরণ (Detailed Message) *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="আপনার সমস্যা বা প্রশ্নের বিস্তারিত বিবরণ লিখুন..."
                  required
                ></textarea>
              </div>

              <div className="gov-form-group">
                <label>ছবি বা নথির সংযুক্তি (Optional Attachment - Photo/Document)</label>
                <input
                  type="file"
                  id="imageUpload"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/jpg, application/pdf"
                />
                <small className="gov-input-hint">সর্বোচ্চ ফাইলের আকার: 5MB (JPG, PNG, PDF)</small>
              </div>

              <button
                type="submit"
                className="gov-btn gov-btn-primary gov-submit-btn"
                disabled={loading}
              >
                {loading ? "জমা দেওয়া হচ্ছে..." : "অভিযোগ জমা দিন / Submit Grievance"} →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showPopup && (
        <div className="gov-modal-overlay">
          <div className="gov-modal-card">
            <div className="gov-modal-icon">✅</div>
            <h3>অভিযোগ সফলভাবে নিবন্ধিত হয়েছে!</h3>
            <p className="gov-modal-sub">
              আপনার অভিযোগের বিবরণ ইরপালা গ্রাম পঞ্চায়েত সহায়তা সেলে পৌঁছে গেছে।
            </p>
            <div className="gov-ticket-box">
              <span>ট্র্যাকিং টিকিট নম্বর:</span>
              <strong>{ticketId}</strong>
            </div>
            <p className="gov-modal-hint">
              ভবিষ্যতে অনুসন্ধানের জন্য এই টিকিট নম্বরটি সংরক্ষণ করে রাখুন।
            </p>
            <button
              className="gov-btn gov-btn-primary"
              onClick={() => setShowPopup(false)}
            >
              ঠিক আছে / OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;