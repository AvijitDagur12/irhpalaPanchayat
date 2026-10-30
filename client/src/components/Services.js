import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const Services = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const servicesData = [
    {
      id: 1,
      title: "ডিজিটাল সনদপত্র ও প্রশংসাপত্র",
      titleEn: "Online Certificates & Verification",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
      description: "আয় সনদপত্র, স্থায়ী বাসিন্দার সার্টিফিকেট, চারিত্রিক সনদপত্র এবং পারিবারিক বিবরণী অনলাইনে আবেদন ও ডাউনলোড।",
      actionText: "আবেদন করুন / Apply",
      actionLink: "/certificate-application",
    },
    {
      id: 2,
      title: "জনঅভিযোগ নিষ্পত্তি ও সহায়তা সেল",
      titleEn: "Public Grievance Redressal",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      description: "পানীয় জল, নিকাশী নালা, রাস্তাঘাট বা গ্রাম পঞ্চায়েতের যে কোনো সমস্যা ছবি সহ সরাসরি অনলাইনে অভিযোগ দাখিল করুন।",
      actionText: "অভিযোগ জানান / File Issue",
      actionLink: "/contact",
    },
    {
      id: 3,
      title: "পানীয় জল সরবরাহ ও স্যানিটেশন",
      titleEn: "Drinking Water & Sanitation",
      image: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?auto=format&fit=crop&w=800&q=80",
      description: "মিশন নির্মল বাংলা ও জল জীবন মিশন অধীনে নলকূপ মেরামত, পাইপলাইনের নতুন সংযোগ এবং পরিচ্ছন্নতা কার্যক্রম।",
      actionText: "সহায়তা চান / Support",
      actionLink: "/contact",
    },
    {
      id: 4,
      title: "গ্রামীণ রাস্তাঘাট ও ড্রেনেজ পরিকাঠামো",
      titleEn: "Rural Roads & Infrastructure",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      description: "পথশ্রী-রাস্তাশ্রী প্রকল্প ও পঞ্চায়েত তহবিলের মাধ্যমে পাকা ঢালাই রাস্তা, কালভার্ট ও নিকাশী ড্রেন নির্মাণ ও রক্ষণাবেক্ষণ।",
      actionText: "পরিকাঠামো প্রস্তাব / Request",
      actionLink: "/contact",
    },
    {
      id: 5,
      title: "সামাজিক সুরক্ষা ও পেনশন যোজনা",
      titleEn: "Social Welfare & Pensions",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
      description: "বার্ধক্য ভাতা, বিধবা ভাতা, মানবিক পেনশন, লক্ষ্মীর ভাণ্ডার ও স্বাস্থ্যসাথী কার্ড সংক্রান্ত তথ্য ও ফর্ম প্রদান।",
      actionText: "তথ্য জানুন / Inquire",
      actionLink: "/contact",
    },
    {
      id: 6,
      title: "কৃষি ও কৃষক কল্যাণ সহায়তা",
      titleEn: "Agriculture & Farmer Support",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      description: "কৃষক বন্ধু সহায়তা, শস্য বীমা, সরকারি বীজ ও সার বণ্টন কর্মসূচি এবং সেচ সংক্রান্ত পরামর্শ ও কৃষক প্রশিক্ষণ।",
      actionText: "তথ্য জানুন / Inquire",
      actionLink: "/contact",
    },
    {
      id: 7,
      title: "গ্রামীণ উৎসব ও সাংস্কৃতিক কার্যক্রম",
      titleEn: "Village Festivals & Culture",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
      description: "দুর্গাপূজা, সরস্বতী পূজা, পৌষ পার্বণ ও অন্যান্য গ্রামীণ উৎসবে পঞ্চায়েতের সহযোগিতা, মঞ্চ ও আলোকসজ্জার ব্যবস্থা।",
      actionText: "বিস্তারিত জানুন / Learn More",
      actionLink: "/contact",
    },
    {
      id: 8,
      title: "যুব কল্যাণ ও কর্মসংস্থান সহায়তা",
      titleEn: "Youth Welfare & Employment",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
      description: "MGNREGA কাজের জবকার্ড, যুব প্রশিক্ষণ কর্মসূচি, স্বনির্ভর গোষ্ঠী (SHG) সহায়তা ও দক্ষতা উন্নয়ন প্রকল্প।",
      actionText: "যোগাযোগ করুন / Contact",
      actionLink: "/contact",
    },
  ];

  /* Static 3-image spotlight below carousel */
  const spotlightImages = [
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFDuyXJsMQzmGAhPFUNkmPWFyFsq9cZQpK4AvbFQU4ykxDZLgo5jwj3M0&s=10",
      title: "লক্ষ্মীর ভাণ্ডার",
      titleEn: "Lakshmi Bhandar Scheme",
      desc: "মহিলাদের আর্থিক সহায়তা প্রকল্প",
    },
    {
      src: "https://media.assettype.com/outlookmoney/2025-08-07/lpi18ap1/Old-Age-Pension.png?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true",
      title: "বার্ধক্য ভাতা",
      titleEn: "Old Age Pension",
      desc: "প্রবীণদের সামাজিক সুরক্ষা",
    },
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4xOc7cX0kdkQQuLIddZdKH5j_dKkObAehM-TlHJwgWw&s=10",
      title: "MGNREGA জবকার্ড",
      titleEn: "Job Card Scheme",
      desc: "১০০ দিনের কাজের নিশ্চয়তা",
    },
  ];

  const carouselItems = [...servicesData, ...servicesData];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId;
    const speed = 0.6;

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="gov-services-section" id="services">
      <div className="gov-services-container">
        <div className="gov-section-header">
          <div className="gov-section-badge">
            <span>⚙️ নাগরিক পরিষেবা ডিরেক্টরি • Public Digital Services</span>
          </div>
          <h2>ডিজিটাল পদ্ধতিতে সহজ পঞ্চায়েত সেবা</h2>
          <p className="gov-section-subtitle">
            ঘরে বসেই স্বচ্ছ, দ্রুত ও জবাবদিহিমূলক নাগরিক পরিষেবা উপভোগ করুন। সরাসরি আবেদন করুন অথবা প্রয়োজনীয় তথ্য সংগ্রহ করুন।
          </p>
        </div>
      </div>

      <div
        className="gov-services-carousel-wrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="gov-services-carousel" ref={scrollRef}>
          {carouselItems.map((service, index) => (
            <div key={`${service.id}-${index}`} className="gov-service-card">
              <div className="gov-service-image-wrap">
                <img
                  src={service.image}
                  alt={service.titleEn}
                  className="gov-service-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    e.target.parentElement.classList.add("img-fallback");
                  }}
                />
              </div>

              <div className="gov-service-body">
                <div className="gov-service-titles">
                  <h3>{service.title}</h3>
                  <span className="gov-service-sub">{service.titleEn}</span>
                </div>

                <p className="gov-service-desc">{service.description}</p>

                <div className="gov-service-action-wrap">
                  <button
                    className="gov-service-btn"
                    onClick={() => navigate(service.actionLink)}
                  >
                    {service.actionText} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-image static spotlight */}
      <div className="gov-services-container">
        <div className="gov-spotlight-section">
          <h3>প্রধান সরকারি সুবিধা</h3>
          <p className="gov-spotlight-sub">Key Government Schemes — Irhpala Gram Panchayat</p>

          <div className="gov-spotlight-grid">
            {spotlightImages.map((img, idx) => (
              <div key={idx} className="gov-spotlight-card">
                <div className="gov-spotlight-img-wrap">
                  <img
                    src={img.src}
                    alt={img.titleEn}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.classList.add("img-fallback");
                    }}
                  />
                </div>
                <div className="gov-spotlight-info">
                  <h4>{img.title}</h4>
                  <span>{img.titleEn}</span>
                  <p>{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;