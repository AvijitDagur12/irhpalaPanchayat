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

  const meetingImages = [
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjouuO-tcXYz0u1ZTD5-UwAQ6b7JgzLvXj3QmUrM03vc2PHrL8SR9z_tGC&s=10",
      alt: "Panchayat Committee Meeting",
      caption: "পঞ্চায়েত কমিটি সভা",
      captionEn: "Committee Meeting",
    },
    {
      src: "https://newsarenaindia.com/_next/image?url=https%3A%2F%2Fimages.newsarenaindia.com%2Fbengal-cabinetjpg_1780234368816.jpg&w=1920&q=75",
      alt: "Administrative Office Discussion",
      caption: "প্রশাসনিক আলোচনা",
      captionEn: "Office Discussion",
    },
    {
      src: "https://images.maher.ac.in/wp-content/uploads/2024/08/Grama-Sabha-Meeting-2-1024x768.jpg?strip=all",
      alt: "Gram Sabha Public Meeting",
      caption: "গ্রাম সভা ও জনসংযোগ",
      captionEn: "Gram Sabha Meeting",
    },
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-fqDNmYpgtCKepKBYkvXnFRa5vQbxxQy7X6P_WwVHeeMV_TFdi9uByNM&s=10",
      alt: "CM Review Meeting",
      caption: "মুখ্যমন্ত্রীর পর্যালোচনা সভা",
      captionEn: "Chief Minister's Review Meeting",
    },
    {
      src: "https://pti-xml.multitvsolution.com/ptiimage/gall_content/2022/PTI05_09_2026_000071B.jpg",
      alt: "Joint Meeting with Prime Minister",
      caption: "প্রধানমন্ত্রীর সাথে যৌথ বৈঠক",
      captionEn: "Joint Meeting with the Prime Minister",
    },
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5V77SSZ58MmQ5dUEZnoHdufAhxxkTMUu6N1VVnGQcTcj0WP2762ETy4&s=10",
      alt: "CM Interaction with Students",
      caption: "মুখ্যমন্ত্রীর সাথে শিক্ষার্থী মিলন",
      captionEn: "Chief Minister's Interaction with Students",
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

        {/* Meeting Gallery (replaces old Priority Services block) */}
        <div className="gov-meeting-gallery-section">
          <h3>পঞ্চায়েত সভা ও প্রশাসনিক কার্যক্রম</h3>
          <p className="gov-meeting-subtitle">
            Irhpala Gram Panchayat • Committee Meetings & Field Operations
          </p>

          <div className="gov-meeting-gallery">
            {meetingImages.map((img, idx) => (
              <div key={idx} className="gov-meeting-card">
                <div className="gov-meeting-img-wrap">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="gov-meeting-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.classList.add("img-fallback");
                    }}
                  />
                </div>
                <div className="gov-meeting-caption">
                  <strong>{img.caption}</strong>
                  <span>{img.captionEn}</span>
                </div>
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
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="gov-leader-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
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