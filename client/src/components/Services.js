import React from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const Services = () => {
  const navigate = useNavigate();

  const servicesData = [
    {
      id: 1,
      title: "ডিজিটাল সনদপত্র ও প্রশংসাপত্র",
      titleEn: "Online Certificates & Verification",
      icon: "📜",
      description: "আয় সনদপত্র, স্থায়ী বাসিন্দার সার্টিফিকেট, চারিত্রিক সনদপত্র এবং পারিবারিক বিবরণী অনলাইনে আবেদন ও ডাউনলোড।",
      tags: ["Income Cert", "Residential", "Character", "Direct PDF"],
      actionText: "আবেদন করুন / Apply",
      actionLink: "/certificate-application",
    },
    {
      id: 2,
      title: "জনঅভিযোগ নিষ্পত্তি ও সহায়তা সেল",
      titleEn: "Public Grievance Redressal",
      icon: "📢",
      description: "পানীয় জল, নিকাশী নালা, রাস্তাঘাট বা গ্রাম পঞ্চায়েতের যে কোনো সমস্যা ছবি সহ সরাসরি অনলাইনে অভিযোগ দাখিল করুন।",
      tags: ["Online Complaint", "Photo Upload", "Tracking ID", "Quick Resolution"],
      actionText: "অভিযোগ জানান / File Issue",
      actionLink: "/contact",
    },
    {
      id: 3,
      title: "পানীয় জল সরবরাহ ও স্যানিটেশন",
      titleEn: "Drinking Water & Sanitation",
      icon: "💧",
      description: "মিশন নির্মল বাংলা ও জল জীবন মিশন অধীনে নলকূপ মেরামত, পাইপলাইনের নতুন সংযোগ এবং পরিচ্ছন্নতা কার্যক্রম।",
      tags: ["Tubewell Repair", "Pipeline Connection", "Water Quality"],
      actionText: "সহায়তা চান / Support",
      actionLink: "/contact",
    },
    {
      id: 4,
      title: "গ্রামীণ রাস্তাঘাট ও ড্রেনেজ পরিকাঠামো",
      titleEn: "Rural Roads & Infrastructure",
      icon: "🛣️",
      description: "পথশ্রী-রাস্তাশ্রী প্রকল্প ও পঞ্চায়েত তহবিলের মাধ্যমে পাকা ঢালাই রাস্তা, কালভার্ট ও নিকাশী ড্রেন নির্মাণ ও রক্ষণাবেক্ষণ।",
      tags: ["Concrete Road", "Drainage", "Solar Lights", "Maintenance"],
      actionText: "পরিকাঠামো প্রস্তাব / Request",
      actionLink: "/contact",
    },
    {
      id: 5,
      title: "সামাজিক সুরক্ষা ও পেনশন যোজনা",
      titleEn: "Social Welfare & Pensions",
      icon: "🤝",
      description: "বার্ধক্য ভাতা, বিধবা ভাতা, মানবিক পেনশন, লক্ষ্মীর ভান্ডার ও স্বাস্থ্যসাথী কার্ড সংক্রান্ত তথ্য ও ফর্ম প্রদান।",
      tags: ["Old Age Pension", "Lakshmir Bhandar", "Swasthya Sathi"],
      actionText: "তথ্য জানুন / Inquire",
      actionLink: "/contact",
    },
    {
      id: 6,
      title: "কৃষি ও কৃষক কল্যাণ সহায়তা",
      titleEn: "Agriculture & Farmer Support",
      icon: "🌾",
      description: "কৃষক বন্ধু সহায়তা, শস্য বীমা, সরকারি বীজ ও সার বণ্টন কর্মসূচি এবং সেচ সংক্রান্ত পরামর্শ ও কৃষক প্রশিক্ষণ।",
      tags: ["Krishak Bandhu", "Crop Insurance", "Subsidized Seeds"],
      actionText: "তথ্য জানুন / Inquire",
      actionLink: "/contact",
    },
  ];

  return (
    <section className="gov-services-section" id="services">
      <div className="gov-services-container">
        {/* Header */}
        <div className="gov-section-header">
          <div className="gov-section-badge">
            <span>⚙️ নাগরিক পরিষেবা ডিরেক্টরি • Public Digital Services</span>
          </div>
          <h2>ডিজিটাল পদ্ধতিতে সহজ পঞ্চায়েত সেবা</h2>
          <p className="gov-section-subtitle">
            ঘরে বসেই স্বচ্ছ, দ্রুত ও জবাবদিহিমূলক নাগরিক পরিষেবা উপভোগ করুন। সরাসরি আবেদন করুন অথবা প্রয়োজনীয় তথ্য সংগ্রহ করুন।
          </p>
        </div>

        {/* Services Grid */}
        <div className="gov-services-grid">
          {servicesData.map((service) => (
            <div key={service.id} className="gov-service-card">
              <div className="gov-card-top">
                <span className="gov-service-icon-box">{service.icon}</span>
                <div className="gov-service-titles">
                  <h3>{service.title}</h3>
                  <span className="gov-service-sub">{service.titleEn}</span>
                </div>
              </div>

              <p className="gov-service-desc">{service.description}</p>

              <div className="gov-service-tags">
                {service.tags.map((tag, idx) => (
                  <span key={idx} className="gov-tag-chip">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="gov-service-action-wrap">
                <button
                  className="gov-service-btn"
                  onClick={() => navigate(service.actionLink)}
                >
                  {service.actionText} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;