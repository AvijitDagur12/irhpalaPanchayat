import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    village: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { loginCitizen, registerCitizen } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Photo must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const res = await loginCitizen(formData.email, formData.password);
        if (res.success) {
          navigate("/dashboard");
        } else {
          setErrorMsg(res.error || "Login failed. Please verify your credentials.");
        }
      } else {
        // REGISTER
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg("Passwords do not match!");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setErrorMsg("Password must be at least 6 characters long.");
          setLoading(false);
          return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("village", formData.village);
        data.append("password", formData.password);
        if (formData.photo) data.append("photo", formData.photo);

        const res = await registerCitizen(data);
        if (res.success) {
          setSuccessMsg("Registration successful! Please sign in with your credentials.");
          setIsLogin(true);
          setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        } else {
          setErrorMsg(res.error || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="citizen-auth-container">
      <div className="citizen-auth-grid">
        {/* Left Side - Brand Section */}
        <div className="citizen-brand-section">
          <div className="citizen-brand-content">
            <div className="citizen-emblem">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1>ইরপালা গ্রাম পঞ্চায়েত</h1>
            <p>Irhpala Gram Panchayat • Ghatal</p>
            <div className="citizen-divider"></div>
            <h2>Citizen Digital Service Portal</h2>
            <p className="citizen-tagline">
              Official online window to apply for certificates, track verification status, and manage verified identity documents.
            </p>
            <div style={{ marginTop: "24px" }}>
              <Link to="/" style={{ color: "#ffffff", fontSize: "0.85rem", textDecoration: "underline" }}>
                ← Return to Panchayat Home
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="citizen-form-section">
          <div className="citizen-form-wrapper">
            <div className="citizen-auth-toggle">
              <button
                type="button"
                className={isLogin ? "citizen-active" : ""}
                onClick={() => {
                  setIsLogin(true);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                নাগরিক লগইন (Sign In)
              </button>
              <button
                type="button"
                className={!isLogin ? "citizen-active" : ""}
                onClick={() => {
                  setIsLogin(false);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                নতুন রেজিস্টার (Create Account)
              </button>
            </div>

            {errorMsg && (
              <div className="gov-alert gov-alert-error" style={{ marginBottom: "16px" }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="gov-alert gov-alert-success" style={{ marginBottom: "16px" }}>
                {successMsg}
              </div>
            )}

            {isLogin ? (
              // LOGIN FORM
              <form className="citizen-form" onSubmit={handleSubmit}>
                <div className="citizen-input-group">
                  <label>Email Address / ইমেল ঠিকানা *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="citizen@example.com"
                    required
                  />
                </div>

                <div className="citizen-input-group">
                  <label>Password / পাসওয়ার্ড *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your account password"
                    required
                  />
                </div>

                <button type="submit" className="gov-btn gov-btn-primary" disabled={loading} style={{ width: "100%", padding: "12px", marginTop: "10px" }}>
                  {loading ? "Authenticating..." : "Sign In to Dashboard →"}
                </button>
              </form>
            ) : (
              // REGISTER FORM
              <form className="citizen-form citizen-register-form" onSubmit={handleSubmit}>
                <div className="citizen-form-grid">
                  <div className="citizen-input-group">
                    <label>Full Name / সম্পূর্ণ নাম *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Chandra Das"
                      required
                    />
                  </div>

                  <div className="citizen-input-group">
                    <label>Email Address / ইমেল *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="citizen@example.com"
                      required
                    />
                  </div>

                  <div className="citizen-input-group">
                    <label>Mobile Number / ফোন নম্বর *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10 digit mobile number"
                      required
                    />
                  </div>

                  <div className="citizen-input-group">
                    <label>Village Name / গ্রামের নাম *</label>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      placeholder="e.g. Irhpala / Joykundu"
                      required
                    />
                  </div>

                  <div className="citizen-input-group">
                    <label>Create Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>

                  <div className="citizen-input-group">
                    <label>Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      required
                    />
                  </div>
                </div>

                <div className="citizen-input-group" style={{ marginTop: "12px" }}>
                  <label>Applicant Photograph (Optional, Max 5MB)</label>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handlePhotoChange}
                  />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      style={{ width: "60px", height: "60px", borderRadius: "4px", objectFit: "cover", marginTop: "8px" }}
                    />
                  )}
                </div>

                <button type="submit" className="gov-btn gov-btn-primary" disabled={loading} style={{ width: "100%", padding: "12px", marginTop: "14px" }}>
                  {loading ? "Registering Account..." : "Create Citizen Account →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;