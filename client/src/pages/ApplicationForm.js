import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ApplicationForm.css';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    district: 'Paschim Medinipur',
    block: 'Ghatal',
    gramPanchayet: 'Irhpala',
    sansad: '',

    salutation: '',
    applicantName: '',
    guardianName: '',
    relation: '',
    address: '',
    email: '',
    post: '',
    policeStation: '',
    village: '',
    pin: '',
    dob: '',
    aadhar: '',

    certificateType: 'residential', // fixed
    annualIncome: '',
    mobile: '',
    whatsapp: '',

    doc1Type: '',
    doc1Number: '',
    doc1File: null,
    doc2Type: '',
    doc2Number: '',
    doc2File: null,
    gsCertificate: null,
    photo: null
  });

  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validatePin = (pin) => /^[0-9]{6}$/.test(pin);
  const validateAadhar = (aadhar) => /^[0-9]{12}$/.test(aadhar);
  const validateNumber = (value) => /^[0-9]+$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) setErrors({ ...errors, [name]: null });

    if (['mobile', 'whatsapp', 'pin', 'aadhar'].includes(name)) {
      if (value && !/^[0-9]*$/.test(value)) return;
    }

    if (name === 'applicantName' || name === 'guardianName') {
      if (value && !/^[A-Za-z\s]*$/.test(value)) return;
    }

    // Document number constraint based on type
    if (name === 'doc1Number' || name === 'doc2Number') {
      const typeKey = name === 'doc1Number' ? 'doc1Type' : 'doc2Type';
      const type = formData[typeKey];
      if (type === 'voter' && !/^[A-Za-z0-9]*$/.test(value)) return;
      if (type === 'pan' && !/^[A-Za-z0-9]*$/.test(value)) return;
      if (type === 'aadhar' && !/^[0-9]*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.sansad) newErrors.sansad = 'Sansad is required';
    }

    if (step === 2) {
      if (!formData.salutation) newErrors.salutation = 'Salutation is required';
      if (!formData.applicantName) newErrors.applicantName = 'Full name is required';
      else if (!validateName(formData.applicantName)) newErrors.applicantName = 'Name should contain only letters';
      if (!formData.guardianName) newErrors.guardianName = 'Guardian name is required';
      else if (!validateName(formData.guardianName)) newErrors.guardianName = 'Guardian name should contain only letters';
      if (!formData.relation) newErrors.relation = 'Relation is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.post) newErrors.post = 'Post office is required';
      if (!formData.policeStation) newErrors.policeStation = 'Police station is required';
      if (!formData.village) newErrors.village = 'Village is required';
      if (!formData.pin) newErrors.pin = 'PIN is required';
      else if (!validatePin(formData.pin)) newErrors.pin = 'PIN must be 6 digits';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      else {
        const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
        if (age < 18) newErrors.dob = 'You must be at least 18 years old';
      }
      if (!formData.aadhar) newErrors.aadhar = 'Aadhar number is required';
      else if (!validateAadhar(formData.aadhar)) newErrors.aadhar = 'Aadhar must be 12 digits';
    }

    if (step === 3) {
      if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required';
      else if (!validateNumber(formData.annualIncome)) newErrors.annualIncome = 'Income must be a number';
      if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
      else if (!validatePhone(formData.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
      if (!formData.whatsapp) newErrors.whatsapp = 'WhatsApp number is required';
      else if (!validatePhone(formData.whatsapp)) newErrors.whatsapp = 'WhatsApp must be 10 digits';
      if (!formData.doc1Type) newErrors.doc1Type = 'Document type is required';
      if (!formData.doc1Number) newErrors.doc1Number = 'Document number is required';
      if (!formData.doc1File) newErrors.doc1File = 'Document file is required';
      if (!formData.doc2Type) newErrors.doc2Type = 'Document type is required';
      if (!formData.doc2Number) newErrors.doc2Number = 'Document number is required';
      if (!formData.doc2File) newErrors.doc2File = 'Document file is required';
      if (!formData.gsCertificate) newErrors.gsCertificate = 'GS certificate is required';
      if (!formData.photo) newErrors.photo = 'Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = () => {
    if (step === 1) return !!formData.sansad.trim();
    if (step === 2) {
      return (
        formData.salutation && formData.applicantName && validateName(formData.applicantName) &&
        formData.guardianName && validateName(formData.guardianName) && formData.relation &&
        formData.address && formData.email && validateEmail(formData.email) &&
        formData.post && formData.policeStation && formData.village &&
        formData.pin && validatePin(formData.pin) && formData.dob &&
        new Date().getFullYear() - new Date(formData.dob).getFullYear() >= 18 &&
        formData.aadhar && validateAadhar(formData.aadhar)
      );
    }
    if (step === 3) {
      return (
        formData.annualIncome && validateNumber(formData.annualIncome) &&
        formData.mobile && validatePhone(formData.mobile) &&
        formData.whatsapp && validatePhone(formData.whatsapp) &&
        formData.doc1Type && formData.doc1Number && formData.doc1File &&
        formData.doc2Type && formData.doc2Number && formData.doc2File &&
        formData.gsCertificate && formData.photo
      );
    }
    return false;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const openConfirm = (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        alert('User not found. Please login again.');
        navigate('/auth');
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key.includes('File') || key.includes('Certificate') || key === 'photo') {
          if (formData[key]) data.append(key, formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });
      data.append('userId', user._id.toString());

      const res = await api.post('/api/apply', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.success) {
        setApplicationId(res.data.applicationNumber || res.data.applicationId);
        setShowPopup(true);
      } else {
        alert('Submission completed.');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Operation failed: ' + (err.message || 'Unknown error'));
    }
  };

  const renderDocNumberInput = (field, typeField) => {
    const type = formData[typeField];
    let maxLength = 30;
    let placeholder = 'Enter document number';
    if (type === 'aadhar') { maxLength = 12; placeholder = '12-digit Aadhar number'; }
    if (type === 'voter') { maxLength = 10; placeholder = 'Voter ID (e.g., ABC1234567)'; }
    if (type === 'pan') { maxLength = 10; placeholder = 'PAN (e.g., ABCDE1234F)'; }
    return (
      <input
        type="text"
        name={field}
        value={formData[field]}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder={placeholder}
        required
      />
    );
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Application Form</h2>
        <p className="form-subtitle">Official Certificate Application Portal</p>
      </div>

      <div className="steps">
        <div className="step-indicator">
          <div className={`step-item ${step > 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
            <div className="step-circle">
              <span className="step-number">1</span>
              {step > 1 && <span className="check-mark">✓</span>}
            </div>
            <div className="step-label">Location</div>
          </div>
          <div className={`step-line ${step > 1 ? 'completed' : ''}`}></div>

          <div className={`step-item ${step > 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
            <div className="step-circle">
              <span className="step-number">2</span>
              {step > 2 && <span className="check-mark">✓</span>}
            </div>
            <div className="step-label">Personal</div>
          </div>
          <div className={`step-line ${step > 2 ? 'completed' : ''}`}></div>

          <div className={`step-item ${step === 3 ? 'active' : ''}`}>
            <div className="step-circle">
              <span className="step-number">3</span>
            </div>
            <div className="step-label">Documents</div>
          </div>
        </div>
      </div>

      <form onSubmit={openConfirm}>
        {step === 1 && (
          <div className="form-step">
            <h3>📍 Location Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>District</label>
                <input type="text" value={formData.district} readOnly className="readonly" />
              </div>
              <div className="form-group">
                <label>Block</label>
                <input type="text" value={formData.block} readOnly className="readonly" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gram Panchayet</label>
                <input type="text" value={formData.gramPanchayet} readOnly className="readonly" />
              </div>
              <div className="form-group">
                <label>Sansad <span className="req">*</span></label>
                <select name="sansad" value={formData.sansad} onChange={handleChange} required>
                  <option value="">Select Sansad</option>
                  <option value="IRHPALA / I - DEBI KOTAL">IRHPALA / I - DEBI KOTAL</option>
                  <option value="IRHPALA / II - DIPAK CHATTACHARAYA">IRHPALA / II - DIPAK CHATTACHARAYA</option>
                  <option value="IRHPALA / III - BASANTI POREY">IRHPALA / III - BASANTI POREY</option>
                  <option value="IRHPALA / IV - MAYNA DAS">IRHPALA / IV - MAYNA DAS</option>
                  <option value="IRHPALA / V - PRATAP JANA">IRHPALA / V - PRATAP JANA</option>
                  <option value="IRHPALA / VI - SARNALATA MANDAL KHAN">IRHPALA / VI - SARNALATA MANDAL KHAN</option>
                  <option value="IRHPALA / VII - RAMA MONDAL">IRHPALA / VII - RAMA MONDAL</option>
                  <option value="IRHPALA / VIII - JOYDEB DOLUI">IRHPALA / VIII - JOYDEB DOLUI</option>
                  <option value="IRHPALA / IX - ARPITA MANDAL">IRHPALA / IX - ARPITA MANDAL</option>
                  <option value="IRHPALA / X - UTTAM DOLAI">IRHPALA / X - UTTAM DOLAI</option>
                  <option value="IRHPALA / XI - BIKASH KOTAL">IRHPALA / XI - BIKASH KOTAL</option>
                  <option value="IRHPALA / XII - SANGITA DIGAR">IRHPALA / XII - SANGITA DIGAR</option>
                  <option value="IRHPALA / XIII - NABIN KHAN">IRHPALA / XIII - NABIN KHAN</option>
                  <option value="IRHPALA / XIV - KALPANA MALIK DIGPATI">IRHPALA / XIV - KALPANA MALIK DIGPATI</option>
                </select>
                {errors.sansad && <span className="error-message">{errors.sansad}</span>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3>👤 Personal Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Salutation <span className="req">*</span></label>
                <select name="salutation" value={formData.salutation} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Mr">Mr.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Ms">Ms.</option>
                </select>
                {errors.salutation && <span className="error-message">{errors.salutation}</span>}
              </div>
              <div className="form-group">
                <label>Full Name <span className="req">*</span></label>
                <input type="text" name="applicantName" value={formData.applicantName}
                  onChange={handleChange} placeholder="Only letters" required />
                {errors.applicantName && <span className="error-message">{errors.applicantName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Guardian Name <span className="req">*</span></label>
                <input type="text" name="guardianName" value={formData.guardianName}
                  onChange={handleChange} placeholder="Only letters" required />
                {errors.guardianName && <span className="error-message">{errors.guardianName}</span>}
              </div>
              <div className="form-group">
                <label>Relation <span className="req">*</span></label>
                <select name="relation" value={formData.relation} onChange={handleChange} required>
                  <option value="">Select Relation</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Sister">Sister</option>
                  <option value="Brother">Brother</option>
                  <option value="Husband">Husband</option>
                  <option value="Wife">Wife</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
                {errors.relation && <span className="error-message">{errors.relation}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Address <span className="req">*</span></label>
              <textarea name="address" value={formData.address} onChange={handleChange} required rows="2"></textarea>
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email <span className="req">*</span></label>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="example@email.com" required />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Post Office <span className="req">*</span></label>
                <input type="text" name="post" value={formData.post} onChange={handleChange} required />
                {errors.post && <span className="error-message">{errors.post}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Police Station <span className="req">*</span></label>
                <input type="text" name="policeStation" value={formData.policeStation} onChange={handleChange} required />
                {errors.policeStation && <span className="error-message">{errors.policeStation}</span>}
              </div>
              <div className="form-group">
                <label>Village <span className="req">*</span></label>
                <input type="text" name="village" value={formData.village} onChange={handleChange} required />
                {errors.village && <span className="error-message">{errors.village}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>PIN <span className="req">*</span></label>
                <input type="text" name="pin" value={formData.pin} onChange={handleChange}
                  maxLength="6" placeholder="6 digits" required />
                {errors.pin && <span className="error-message">{errors.pin}</span>}
              </div>
              <div className="form-group">
                <label>Date of Birth <span className="req">*</span></label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                {errors.dob && <span className="error-message">{errors.dob}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Aadhar Number <span className="req">*</span></label>
              <input type="text" name="aadhar" value={formData.aadhar} onChange={handleChange}
                maxLength="12" placeholder="12-digit Aadhar number" required />
              {errors.aadhar && <span className="error-message">{errors.aadhar}</span>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h3>📄 Application Details</h3>

            <div className="form-group">
              <label>Certificate Type</label>
              <div className="radio-group">
                <label className="radio-fixed">
                  <input type="radio" name="certificateType" value="residential" checked readOnly />
                  Residential <span className="fixed-badge">Fixed</span>
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Annual Income (₹) <span className="req">*</span></label>
                <input type="text" name="annualIncome" value={formData.annualIncome}
                  onChange={handleChange} placeholder="e.g., 500000" required />
                {errors.annualIncome && <span className="error-message">{errors.annualIncome}</span>}
              </div>
              <div className="form-group">
                <label>Mobile Number <span className="req">*</span></label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
                  maxLength="10" placeholder="10-digit mobile" required />
                {errors.mobile && <span className="error-message">{errors.mobile}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>WhatsApp Number <span className="req">*</span></label>
              <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                maxLength="10" placeholder="10-digit WhatsApp" required />
              {errors.whatsapp && <span className="error-message">{errors.whatsapp}</span>}
            </div>

            <h4>📎 Document 1</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Document Type <span className="req">*</span></label>
                <select name="doc1Type" value={formData.doc1Type} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="voter">Voter ID</option>
                </select>
                {errors.doc1Type && <span className="error-message">{errors.doc1Type}</span>}
              </div>
              <div className="form-group">
                <label>Document Number <span className="req">*</span></label>
                {renderDocNumberInput('doc1Number', 'doc1Type')}
                {errors.doc1Number && <span className="error-message">{errors.doc1Number}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Upload File <span className="req">*</span></label>
              <input type="file" name="doc1File" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
              {errors.doc1File && <span className="error-message">{errors.doc1File}</span>}
            </div>

            <h4>📎 Document 2</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Document Type <span className="req">*</span></label>
                <select name="doc2Type" value={formData.doc2Type} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="voter">Voter ID</option>
                </select>
                {errors.doc2Type && <span className="error-message">{errors.doc2Type}</span>}
              </div>
              <div className="form-group">
                <label>Document Number <span className="req">*</span></label>
                {renderDocNumberInput('doc2Number', 'doc2Type')}
                {errors.doc2Number && <span className="error-message">{errors.doc2Number}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Upload File <span className="req">*</span></label>
              <input type="file" name="doc2File" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
              {errors.doc2File && <span className="error-message">{errors.doc2File}</span>}
            </div>

            <div className="form-group">
              <label>নির্বাচিত সদস্য প্রশংসাপত্র / Elected Member Certificate <span className="req">*</span></label>
              <small className="help-text">
                Upload your approved Elected Member Certificate PDF or photo received from the Member Desk.
              </small>
              <input type="file" name="gsCertificate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
              {errors.gsCertificate && <span className="error-message">{errors.gsCertificate}</span>}
            </div>

            <div className="form-group">
              <label>Candidate Photo <span className="req">*</span></label>
              <input type="file" name="photo" onChange={handleFileChange} accept=".jpg,.jpeg,.png" required />
              {errors.photo && <span className="error-message">{errors.photo}</span>}
            </div>
          </div>
        )}

        <div className="form-buttons">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="prev-btn">
              ← Previous
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={handleNext}
              className={`next-btn ${!isStepValid() ? 'disabled' : ''}`}
              disabled={!isStepValid()}>
              Next →
            </button>
          ) : (
            <button type="submit" className="submit-btn" disabled={!isStepValid()}>
              Submit Application
            </button>
          )}
        </div>
      </form>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup confirm-popup">
            <div className="confirm-icon">⚠️</div>
            <h3>Confirm Submission</h3>
            <p>Please review your details carefully. Once submitted, the application cannot be edited.</p>
            <p className="small">Are you sure you want to submit this application?</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleSubmit}>Yes, Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="success-icon">✅</div>
            <h3>Application Submitted Successfully!</h3>
            <p>Your Application ID:</p>
            <h2>{applicationId}</h2>
            <p className="small">Please save this ID for future reference</p>
            <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;