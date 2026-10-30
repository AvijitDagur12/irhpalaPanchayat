import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { getAssetUrl } from "../services/api";
import "./ManageProfile.css";

const ManageProfile = () => {
  const navigate = useNavigate();
  const { user, updateCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // User details state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    village: "",
    photo: null,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: "",
    file: null,
  });

  const fetchUserDocuments = useCallback(async (userId) => {
    try {
      const res = await api.get(`/api/user-documents/${userId}`);
      setDocuments(res.data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        village: user.village || "",
        photo: null,
      });
      fetchUserDocuments(user._id);
    }
  }, [user, navigate, fetchUserDocuments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoc((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocFileChange = (e) => {
    setNewDoc((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("village", formData.village);
      if (formData.photo) data.append("photo", formData.photo);
      data.append("userId", user._id);

      const res = await api.put("/api/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.user) {
        setIsSuccess(true);
        setMessage("প্রোফাইল সফলভাবে আপডেট করা হয়েছে! (Profile updated successfully!)");
        updateCurrentUser(res.data.user);
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.message || "Operation failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setIsSuccess(false);
      setMessage("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setIsSuccess(false);
      setMessage("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.put("/api/update-password", {
        userId: user._id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setIsSuccess(true);
      setMessage("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! (Password updated successfully!)");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.message || "Failed to update password. Please check current password.");
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (e) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.file) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", newDoc.name);
      data.append("file", newDoc.file);
      data.append("userId", user._id);

      const res = await api.post("/api/upload-document", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.document) {
        setDocuments((prev) => [res.data.document, ...prev]);
        setShowDocUpload(false);
        setNewDoc({ name: "", file: null });
        setIsSuccess(true);
        setMessage("নথি সফলভাবে আপলোড করা হয়েছে! (Document uploaded to vault!)");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.message || "Error uploading document.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (docId) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে আপনি এই নথিটি মুছে ফেলতে চান?")) return;

    try {
      await api.delete(`/api/delete-document/${docId}`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== docId));
      setIsSuccess(true);
      setMessage("নথি সফলভাবে মুছে ফেলা হয়েছে। (Document deleted.)");
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage("Failed to delete document.");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header-bar">
        <div>
          <h2>নাগরিক প্রোফাইল ও নথি ভল্ট (Citizen Profile & Vault)</h2>
          <p>আপনার ব্যক্তিগত বিবরণ এবং স্থায়ী নথিপত্র নিরাপদে সংরক্ষণ ও পরিচালনা করুন।</p>
        </div>
        <Link to="/dashboard" className="gov-btn gov-btn-outline">
          ← Back to Dashboard
        </Link>
      </div>

      {message && (
        <div className={`gov-alert ${isSuccess ? "gov-alert-success" : "gov-alert-error"}`}>
          {message}
        </div>
      )}

      {/* Profile Details Form */}
      <form onSubmit={updateProfile} className="profile-form">
        <h3>ব্যক্তিগত বিবরণ (Personal Details)</h3>
        <div className="profile-photo-row">
          <div className="profile-avatar-wrap">
            {user.photo ? (
              <img src={getAssetUrl(user.photo)} alt="Profile Avatar" className="profile-preview" />
            ) : (
              <div className="profile-avatar-placeholder">{user.name?.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="form-group" style={{ flexGrow: 1 }}>
            <label>প্রোফাইল ছবি পরিবর্তন করুন (Change Profile Photo)</label>
            <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={handlePhotoChange} />
            <small className="gov-input-hint">অনুমোদিত ফরম্যাট: JPG, PNG (সর্বোচ্চ 5MB)</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>সম্পূর্ণ নাম (Full Name)</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>ইমেল ঠিকানা (Email - Readonly)</label>
            <input type="email" name="email" value={formData.email} readOnly className="readonly" />
            <small className="gov-input-hint">ইমেল ঠিকানা পরিবর্তনযোগ্য নয়</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>মোবাইল নম্বর (Phone)</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>গ্রামের নাম (Village)</label>
            <input type="text" name="village" value={formData.village} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="gov-btn gov-btn-primary" disabled={loading}>
            {loading ? "সংরক্ষণ করা হচ্ছে..." : "প্রোফাইল আপডেট করুন / Save Changes"}
          </button>
        </div>
      </form>

      {/* Password Change Section */}
      <div className="password-section">
        <div className="password-header">
          <h3>নিরাপত্তা ও পাসওয়ার্ড (Security & Password)</h3>
          {!showPasswordForm && (
            <button
              type="button"
              className="gov-btn gov-btn-outline"
              onClick={() => setShowPasswordForm(true)}
            >
              🔑 পাসওয়ার্ড পরিবর্তন করুন (Change Password)
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={updatePassword} className="password-form">
            <div className="form-row">
              <div className="form-group">
                <label>বর্তমান পাসওয়ার্ড (Current Password) *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>নতুন পাসওয়ার্ড (New Password) *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Min 6 characters"
                  required
                />
              </div>

              <div className="form-group">
                <label>পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>

            <div className="button-group">
              <button type="submit" className="gov-btn gov-btn-secondary" disabled={loading}>
                {loading ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড নিশ্চিত করুন / Update Password"}
              </button>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setShowPasswordForm(false)}
              >
                বাতিল (Cancel)
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Documents Vault Section */}
      <div className="documents-section">
        <div className="documents-header">
          <div>
            <h3>আপনার ডিজিটাল নথি ভল্ট (Citizen Document Vault)</h3>
            <p className="gov-input-hint">আধার কার্ড, ভোটার কার্ড বা শিক্ষাগত সনদপত্র নিরাপদে সংরক্ষণ করুন।</p>
          </div>
          {!showDocUpload && (
            <button className="gov-btn gov-btn-primary" onClick={() => setShowDocUpload(true)}>
              + নতুন নথি যোগ করুন (Add Document)
            </button>
          )}
        </div>

        {showDocUpload && (
          <form onSubmit={uploadDocument} className="upload-doc-form">
            <div className="form-row">
              <div className="form-group">
                <label>নথির নাম (Document Title) *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="উদাঃ আধার কার্ড / ভোটার আইডি"
                  value={newDoc.name}
                  onChange={handleDocInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>ফাইল নির্বাচন করুন (Select PDF or Image) *</label>
                <input
                  type="file"
                  accept="application/pdf, image/jpeg, image/png"
                  onChange={handleDocFileChange}
                  required
                />
              </div>
            </div>
            <div className="button-group">
              <button type="submit" className="gov-btn gov-btn-primary" disabled={loading}>
                {loading ? "আপলোড হচ্ছে..." : "নথি আপলোড করুন / Upload"}
              </button>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setShowDocUpload(false)}
              >
                বাতিল (Cancel)
              </button>
            </div>
          </form>
        )}

        <div className="documents-list">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div key={doc._id} className="document-item">
                <div className="doc-info">
                  <span className="doc-icon">📑</span>
                  <div>
                    <strong>{doc.name}</strong>
                    <small>{new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString("en-IN")}</small>
                  </div>
                </div>
                <div className="doc-actions">
                  <a
                    href={getAssetUrl(doc.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gov-btn gov-btn-outline"
                  >
                    👁️ দেখুন (View)
                  </a>
                  <button
                    onClick={() => deleteDocument(doc._id)}
                    className="gov-btn gov-btn-outline"
                    style={{ color: "#b91c1c", borderColor: "#fecaca" }}
                  >
                    🗑️ মুছুন (Delete)
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-docs-note">
              <span>📂</span>
              <p>আপনার ভল্টে এখনো কোনো নথি আপলোড করা নেই।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;