import React from "react";
import "./About.css";
import PradhanImg from "../assets/prodhan.jpg";
import UpPradhanImg from "../assets/upo.avif";

const About = () => {
  const panchayat = {
    name: "ইরপালা গ্রাম পঞ্চায়েত",
    nameEn: "Irhpala Gram Panchayat",
    block: "Ghatal",
    district: "Paschim Medinipur",
    state: "West Bengal",
    established: "1952",
    office: "Irhpala Gram Panchayat Bhavan",
    population: "8,240+",
    households: "1,620+",
    villagesCovered: "12",
    pinCode: "721212",
    email: "irhpala.gp@wb.gov.in",
    helpline: "03225-244100",
  };

  const statsData = [
    { value: panchayat.established, label: "Year Established", icon: "🏛️" },
    { value: panchayat.population, label: "Total Population", icon: "👥" },
    { value: panchayat.households, label: "Households Covered", icon: "🏠" },
    { value: panchayat.villagesCovered, label: "Sansad Wards", icon: "🌾" },
  ];

  const leaders = [
    {
      name: "Smt. Basanti Porey",
      role: "Pradhan (প্রধান)",
      village: "Jadupur",
      tenure: "2023 - Present",
      phone: "+91 9876543210",
      image: PradhanImg,
      ward: "Ward No. 05 (Sansad V)",
    },
    {
      name: "Sri Uttam Samanta",
      role: "Upa Pradhan (উপ-প্রধান)",
      village: "Joykundu",
      tenure: "2023 - Present",
      phone: "+91 8765432109",
      image: UpPradhanImg,
      ward: "Ward No. 08 (Sansad VIII)",
    },
  ];

  const coreServices = [
    {
      icon: "📜",
      title: "ডিজিটাল সনদপত্র / Certificates",
      desc: "আয়, স্থায়ী বাসিন্দা, চারিত্রিক ও অন্যান্য সরকারি সনদপত্র সরাসরি অনলাইন প্রক্রিয়াকরণ।",
    },
    {
      icon: "💧",
      title: "পানীয় জল ও স্যানিটেশন / Utilities",
      desc: "মিশন নির্মল বাংলা ও জল স্বপ্ন প্রকল্পের মাধ্যমে গ্রামীণ পরিবারে বিশুদ্ধ পানীয় জল সরবরাহ।",
    },
    {
      icon: "🏗️",
      title: "পরিকাঠামো উন্নয়ন / Infrastructure",
      desc: "গ্রামীণ পাকা রাস্তা, কালভার্ট, বৃষ্টির জল নিষ্কাশন ও সৌর বিদ্যুৎ বাতির রক্ষণাবেক্ষণ।",
    },
    {
      icon: "📢",
      title: "নাগরিক অভিযোগ প্রতিকার / Grievance Cell",
      desc: "দ্রুত ও সময়বদ্ধ জনঅভিযোগ নিষ্পত্তি এবং স্বচ্ছ প্রশাসনিক ব্যবস্থা।",
    },
  ];

  return (
    <section className="gov-about-section" id="about">
      <div className="gov-about-container">
        {/* Section Header */}
        <div className="gov-section-header">
          <div className="gov-section-badge">
            <span>🏛️ পরিচিতি ও প্রশাসনিক তথ্য • About The Panchayat</span>
          </div>
          <h2>{panchayat.name} ({panchayat.nameEn})</h2>
          <p className="gov-section-subtitle">
            ঘাটাল ব্লক • পশ্চিম মেদিনীপুর জেলা • পশ্চিমবঙ্গ সরকার | পঞ্চায়েতী রাজ ডিজিটাল পরিষেবা
          </p>
        </div>

        {/* Stats Row */}
        <div className="gov-stats-grid">
          {statsData.map((stat, idx) => (
            <div key={idx} className="gov-stat-card">
              <span className="gov-stat-icon">{stat.icon}</span>
              <div className="gov-stat-content">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Overview */}
        <div className="gov-about-grid">
          {/* Left: Administrative Profile */}
          <div className="gov-about-card">
            <h3>📖 প্রশাসনিক বিবরণ / Institutional Overview</h3>
            <p>
              <strong>{panchayat.name}</strong> stands as an established institution of local self-governance under the West Bengal Panchayat Act. Serving all local communities and households with dedication, the Gram Panchayat is committed to participatory democracy, socio-economic welfare, and rapid public service delivery.
            </p>
            <p>
              Through this Unified Digital Panchayat Portal, citizens can apply for essential certificates, track verification progress in real-time, register public grievances, and access all flagship state and central welfare schemes without visiting government offices.
            </p>
            <div className="gov-feature-list">
              <div className="gov-feature-item">
                <span className="gov-check">✓</span> 100% Digital Certificate Processing & PDF Issuance
              </div>
              <div className="gov-feature-item">
                <span className="gov-check">✓</span> Direct Public Grievance Tracking & Time-Bound Redressal
              </div>
              <div className="gov-feature-item">
                <span className="gov-check">✓</span> Transparent Rural Infrastructure Planning & Audit
              </div>
            </div>
          </div>

          {/* Right: Key Objectives & Mission */}
          <div className="gov-about-card">
            <h3>🎯 লক্ষ্য ও উদ্দেশ্য / Vision & Objectives</h3>
            <div className="gov-vision-box">
              <div className="gov-vision-item">
                <span className="gov-v-icon">🌟</span>
                <div>
                  <h4>আমাদের লক্ষ্য (Our Vision)</h4>
                  <p>একটি স্বনির্ভর, স্বচ্ছ, পরিবেশবান্ধব ও প্রযুক্তিনির্ভর আদর্শ গ্রাম পঞ্চায়েত গড়ে তোলা, যেখানে প্রতিটি নাগরিক সরকারি সুযোগ-সুবিধা ও সুরক্ষা নিশ্চিতভাবে পাবেন।</p>
                </div>
              </div>
              <div className="gov-vision-item">
                <span className="gov-v-icon">🚀</span>
                <div>
                  <h4>আমাদের কার্যপ্রণালী (Our Mission)</h4>
                  <p>ডিজিটাল প্রযুক্তির ব্যবহারে নাগরিক সেবা দ্রুত প্রদান, স্বচ্ছ তহবিল পরিচালনা, সামাজিক নিরাপত্তা যোজনা সম্প্রসারণ এবং গ্রামবাসীর অংশগ্রহণে সার্বিক গ্রামীণ উন্নয়ন।</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Services Grid */}
        <div className="gov-services-summary">
          <h3>মুখ্য সেবাসমূহ / Priority Digital Services</h3>
          <div className="gov-services-cards">
            {coreServices.map((srv, idx) => (
              <div key={idx} className="gov-service-mini-card">
                <span className="gov-service-mini-icon">{srv.icon}</span>
                <h4>{srv.title}</h4>
                <p>{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Section */}
        <div className="gov-leadership-section">
          <h3>পঞ্চায়েত নেতৃত্ব / Executive Committee Leadership</h3>
          <div className="gov-leadership-grid">
            {leaders.map((leader, idx) => (
              <div key={idx} className="gov-leader-card">
                <div className="gov-leader-img-wrapper">
                  <img src={leader.image} alt={leader.name} className="gov-leader-img" />
                  <span className="gov-leader-badge">{leader.role}</span>
                </div>
                <div className="gov-leader-info">
                  <h4>{leader.name}</h4>
                  <p className="gov-leader-ward">📍 {leader.ward} • {leader.village}</p>
                  <p className="gov-leader-tenure">কার্যকাল: {leader.tenure}</p>
                  <div className="gov-leader-contact">
                    <span>📞 {leader.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;