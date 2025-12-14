import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

// Simple Animated Card Component
const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};



// Clean Confetti Component
const Confetti = ({ isActive = false }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
        size: Math.random() * 6 + 2,
        speed: Math.random() * 2 + 1,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            animationDuration: `${particle.speed}s`
          }}
        />
      ))}
    </div>
  );
};

// Clean Strength/Weakness Card Component
const StrengthWeaknessCard = ({ item, type }) => {
  const isStrength = type === "strength";
  const colors = isStrength
    ? "border-green-500 bg-green-50"
    : "border-orange-500 bg-orange-50";

  const textColors = isStrength ? "text-green-800" : "text-orange-800";

  return (
    <div className={`p-6 rounded-lg border-l-4 ${colors}`}>
      <h4 className={`font-semibold ${textColors} mb-2`}>{item[type]}</h4>
      <p className={`${textColors} text-sm leading-relaxed`}>{item.description}</p>
    </div>
  );
};

// Enhanced Interactive Chart Component
const InteractiveChart = ({ chartData }) => {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = React.useState(null);
  const [tooltip, setTooltip] = React.useState({
    show: false,
    x: 0,
    y: 0,
    value: "",
    label: "",
  });

  useEffect(() => {
    if (
      !chartData ||
      !chartData.labels ||
      !chartData.data ||
      !canvasRef.current
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the drawing context so everything will work at the higher ratio
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 80;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background with gradient
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.05)");
    gradient.addColorStop(1, "rgba(168, 85, 247, 0.02)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid circles with enhanced styling
    const gridLines = [0.2, 0.4, 0.6, 0.8, 1.0];
    gridLines.forEach((ratio, index) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * ratio, 0, 2 * Math.PI);

      if (index === gridLines.length - 1) {
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(99, 102, 241, 0.3)";
        ctx.shadowBlur = 5;
      } else {
        ctx.strokeStyle = `rgba(156, 163, 175, ${0.2 + ratio * 0.3})`;
        ctx.lineWidth = 1;
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
      ctx.stroke();

      // Add value labels on circles with better styling
      if (index < gridLines.length - 1) {
        ctx.fillStyle = "#6b7280";
        ctx.font = "bold 11px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "transparent";
        ctx.fillText(
          (ratio * 100).toFixed(0),
          centerX,
          centerY - radius * ratio + 4
        );
      }
    });

    // Calculate points and draw enhanced axes
    const points = [];
    const angleStep = (2 * Math.PI) / chartData.labels.length;

    chartData.labels.forEach((label, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = chartData.data[i] || 0;
      const distance = (radius * value) / 100;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);

      points.push({ x, y, value, label, angle, distance });

      // Draw enhanced axes
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.strokeStyle = "rgba(156, 163, 175, 0.4)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "transparent";
      ctx.stroke();

      // Draw enhanced labels
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 14px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const labelDistance = radius + 35;
      const labelX = centerX + labelDistance * Math.cos(angle);
      const labelY = centerY + labelDistance * Math.sin(angle);

      // Add enhanced background to labels
      const textMetrics = ctx.measureText(label);
      const padding = 8;
      
      // Create gradient background for labels
      const labelGradient = ctx.createLinearGradient(
        labelX - textMetrics.width / 2 - padding,
        labelY - 10,
        labelX + textMetrics.width / 2 + padding,
        labelY + 10
      );
      labelGradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      labelGradient.addColorStop(1, "rgba(248, 250, 252, 0.9)");
      
      ctx.fillStyle = labelGradient;
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      
      // Draw rounded rectangle for label background
      const rectX = labelX - textMetrics.width / 2 - padding;
      const rectY = labelY - 10 - padding;
      const rectWidth = textMetrics.width + padding * 2;
      const rectHeight = 20 + padding * 2;
      const cornerRadius = 8;
      
      ctx.beginPath();
      ctx.moveTo(rectX + cornerRadius, rectY);
      ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
      ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius);
      ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
      ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight);
      ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
      ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius);
      ctx.lineTo(rectX, rectY + cornerRadius);
      ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY);
      ctx.closePath();
      ctx.fill();

      // Draw label text
      ctx.fillStyle = "#1f2937";
      ctx.shadowColor = "transparent";
      ctx.fillText(label, labelX, labelY);
    });

    // Draw enhanced data area
    if (points.length > 0) {
      ctx.beginPath();
      points.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();

      // Fill with enhanced gradient
      const dataGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      dataGradient.addColorStop(0, "rgba(99, 102, 241, 0.6)");
      dataGradient.addColorStop(0.7, "rgba(168, 85, 247, 0.3)");
      dataGradient.addColorStop(1, "rgba(236, 72, 153, 0.1)");
      ctx.fillStyle = dataGradient;
      ctx.fill();

      // Enhanced stroke
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 4;
      ctx.shadowColor = "rgba(99, 102, 241, 0.4)";
      ctx.shadowBlur = 8;
      ctx.stroke();
    }

    // Draw enhanced data points
    points.forEach((point, i) => {
      const isHovered = hoveredPoint === i;
      const pointRadius = isHovered ? 10 : 7;

      // Enhanced shadow for points
      ctx.shadowColor = isHovered ? "rgba(99, 102, 241, 0.6)" : "rgba(99, 102, 241, 0.3)";
      ctx.shadowBlur = isHovered ? 15 : 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Outer ring with gradient
      const outerGradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, pointRadius + 3
      );
      outerGradient.addColorStop(0, "#ffffff");
      outerGradient.addColorStop(1, "#e5e7eb");
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius + 3, 0, 2 * Math.PI);
      ctx.fillStyle = outerGradient;
      ctx.fill();

      // Inner point with gradient
      const innerGradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, pointRadius
      );
      innerGradient.addColorStop(0, isHovered ? "#8b5cf6" : "#6366f1");
      innerGradient.addColorStop(1, isHovered ? "#6366f1" : "#4f46e5");
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
      ctx.fillStyle = innerGradient;
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Value labels on hover with enhanced styling
      if (isHovered) {
        ctx.fillStyle = "#1f2937";
        ctx.font = "bold 16px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.shadowBlur = 4;
        ctx.fillText(
          point.value.toFixed(1) + "%",
          point.x,
          point.y - pointRadius - 20
        );
        ctx.shadowColor = "transparent";
      }
    });
  }, [chartData, hoveredPoint]);

  // Handle mouse events for interactivity
  const handleMouseMove = (event) => {
    if (!canvasRef.current || !chartData) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) / 2 - 80;

    // Check if mouse is over any data point
    let foundHover = false;
    const angleStep = (2 * Math.PI) / chartData.labels.length;

    chartData.data.forEach((value, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const distance = (radius * value) / 100;
      const pointX = centerX + distance * Math.cos(angle);
      const pointY = centerY + distance * Math.sin(angle);

      const dist = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);

      if (dist < 20) {
        setHoveredPoint(i);
        setTooltip({
          show: true,
          x: event.clientX,
          y: event.clientY,
          value: value.toFixed(1),
          label: chartData.labels[i],
        });
        foundHover = true;
      }
    });

    if (!foundHover) {
      setHoveredPoint(null);
      setTooltip({ show: false, x: 0, y: 0, value: "", label: "" });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setTooltip({ show: false, x: 0, y: 0, value: "", label: "" });
  };

  if (!chartData || !chartData.labels || !chartData.data) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 text-sm">Chart data tidak tersedia</p>
      </div>
    );
  }

  return (
    <AnimatedCard>
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          📊 Grafik Skor RIASEC Anda
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          Hover pada titik data untuk melihat detail skor
        </p>

        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl blur-xl opacity-30"></div>
          <canvas
            ref={canvasRef}
            width={450}
            height={450}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative z-10"
            style={{
              width: "450px",
              height: "450px",
              maxWidth: "100%",
              cursor: hoveredPoint !== null ? "pointer" : "default",
              border: "3px solid #e0e7ff",
              borderRadius: "20px",
              backgroundColor: "#ffffff",
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* Enhanced Tooltip */}
          {tooltip.show && (
            <div
              className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
              style={{
                left: tooltip.x,
                top: tooltip.y - 15,
              }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl shadow-2xl">
                <div className="text-center">
                  <div className="font-bold text-lg">{tooltip.label}</div>
                  <div className="text-2xl font-extrabold">{tooltip.value}%</div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-600"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {chartData.labels.map((label, index) => (
            <AnimatedCard key={label} delay={index * 100}>
              <div
                className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  hoveredPoint === index 
                    ? "bg-gradient-to-r from-blue-100 to-purple-100 shadow-lg border-2 border-blue-300" 
                    : "bg-white shadow-md border border-gray-200 hover:shadow-lg"
                }`}
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white shadow-sm"></div>
                <span className={`text-sm font-semibold ${
                  hoveredPoint === index ? "text-blue-700" : "text-gray-700"
                }`}>
                  {label}: {chartData.data[index]?.toFixed(1)}%
                </span>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};

const CombinedResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultsData } = location.state || {};

  // State untuk data API tambahan
  const [skillRoadmap, setSkillRoadmap] = useState(null);
  const [dominantType, setDominantType] = useState(null);
  const [campusActivities, setCampusActivities] = useState(null);
  const [strengthsWeaknesses, setStrengthsWeaknesses] = useState(null);
  const [loadingAdditional, setLoadingAdditional] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Destructure resultsData
  const { results, profile, riasec_explanations, riasec_map_full, chart_data } =
    resultsData || {};

  // Load additional data from APIs
  useEffect(() => {
    if (!resultsData || !profile) return;

    // Trigger confetti on load
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    const loadAdditionalData = async () => {
      setLoadingAdditional(true);
      try {
        // Skill Roadmap
        const roadmapResponse = await axios.post("/api/skill-roadmap/", {
          riasec_code: profile,
          target_jobs: results?.top_2 || []
        });
        setSkillRoadmap(roadmapResponse.data);

        // Dominant Type
        const dominantResponse = await axios.post("/api/dominant-type/", {
          dominant_type: profile
        });
        setDominantType(dominantResponse.data);

        // Campus Activities
        const activitiesResponse = await axios.post("/api/campus-activities/", {
          riasec_code: profile,
          target_jobs: results?.top_2 || []
        });
        setCampusActivities(activitiesResponse.data);

        // Strengths & Weaknesses
        const swResponse = await axios.post("/api/strengths-weaknesses/", {
          riasec_code: profile
        });
        setStrengthsWeaknesses(swResponse.data);

      } catch (error) {
        console.error("Error loading additional data:", error);
      } finally {
        setLoadingAdditional(false);
      }
    };

    loadAdditionalData();
  }, [resultsData, profile, results]);

  if (!resultsData) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl text-red-600 mb-4">
          Data hasil tidak ditemukan.
        </h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Tes
        </button>
      </div>
    );
  }

  return (
    <>
      <Confetti isActive={showConfetti} />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 relative overflow-hidden">
        {/* Background Effects - konsisten dengan LandingPage */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">
          {/* Clean Hero Section */}
          <div className="text-center mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full mb-6">
                <span className="text-3xl">🎯</span>
              </div>

              <h1 className="text-heading-1 text-white mb-4">
                Hasil Tes RIASEC Kamu
              </h1>

              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <span className="text-white text-lg mr-3">Kode RIASEC:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {profile}
                </span>
              </div>

              <p className="text-body text-blue-100 mt-6">
                Selamat! Kamu telah menemukan profil karir yang sesuai dengan kepribadianmu.
              </p>
            </div>
          </div>

          {/* RIASEC Types Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {profile.split("").map((code, index) => (
              <AnimatedCard delay={index * 100}>
                <div className="card-compact">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                      {code}
                    </div>
                    <div>
                      <h3 className="text-heading-3">
                        {riasec_map_full[code]}
                      </h3>
                      <span className="text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                        Type {code}
                      </span>
                    </div>
                  </div>

                  <p className="text-body-sm">
                    {riasec_explanations[code]}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Chart Section dengan style konsisten */}
          <div className="card mb-12">
            <InteractiveChart chartData={chart_data} />
          </div>

          {/* Top Career Recommendations */}
          <div className="card mb-12">
            <div className="text-center mb-8">
              <h2 className="text-heading-2 mb-2">
                Rekomendasi Karir Terbaik
              </h2>
              <p className="text-body">Profesi yang paling sesuai dengan kepribadianmu</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {results.top_2.map((professionName, index) => {
                const profData = results.analysis.find(
                  (p) => p.profession === professionName
                );
                const trophyEmojis = ["🥇", "🥈"];

                return (
                  <AnimatedCard key={profData.profession} delay={index * 200}>
                    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-start mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl mr-4 flex-shrink-0">
                          {trophyEmojis[index]}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {profData.profession}
                          </h3>
                          <div className="flex items-center mb-3">
                            <span className="text-2xl font-bold text-blue-600 mr-2">
                              {profData.match_percentage}%
                            </span>
                            <span className="text-gray-600">kecocokan</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {profData.reason}
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${profData.match_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mb-12">
            <AnimatedCard delay={400}>
              <button
                onClick={() =>
                  navigate("/feedback", { state: { resultsData } })
                }
                className="btn-primary"
              >
                Berikan Feedback
              </button>
            </AnimatedCard>

            <p className="text-body-sm text-gray-600 mt-4">
              Pendapat kamu sangat berarti untuk pengembangan aplikasi ini
            </p>
          </div>

          {/* Additional Analysis Sections */}
          {loadingAdditional ? (
            <div className="text-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Memuat Analisis Tambahan</h3>
                <p className="text-gray-600">Sedang menganalisis data untuk rekomendasi yang lebih lengkap...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Skill Development Roadmap */}
              {skillRoadmap && (
                <AnimatedCard delay={500}>
                  <div className="card">
                    <div className="text-center mb-8">
                      <h2 className="text-heading-2 mb-2">
                        Roadmap Pengembangan Skill
                      </h2>
                      <p className="text-body">Panduan lengkap untuk mengembangkan kemampuan Anda</p>
                    </div>

                    {/* Hard Skills Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                          💻
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Hard Skills</h3>
                        <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                          Technical Skills
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {skillRoadmap.hard_skills?.map((skill, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-800 text-lg">{skill.skill}</h4>
                              <span className={`px-3 py-1 rounded text-xs font-medium ${
                                skill.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {skill.priority}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 leading-relaxed">{skill.description}</p>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="font-semibold text-gray-700 mb-3">Langkah Aksi:</h5>
                              <ul className="space-y-2">
                                {skill.action_steps?.map((step, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start">
                                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-gray-700 text-sm">{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Soft Skills Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-3">
                          🧠
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Soft Skills</h3>
                        <span className="ml-3 bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                          Interpersonal Skills
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {skillRoadmap.soft_skills?.map((skill, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-800 text-lg">{skill.skill}</h4>
                              <span className={`px-3 py-1 rounded text-xs font-medium ${
                                skill.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {skill.priority}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 leading-relaxed">{skill.description}</p>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="font-semibold text-gray-700 mb-3">Langkah Aksi:</h5>
                              <ul className="space-y-2">
                                {skill.action_steps?.map((step, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start">
                                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-gray-700 text-sm">{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {skillRoadmap.roadmap_notes && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Catatan Roadmap</h4>
                        <p className="text-blue-700 leading-relaxed">{skillRoadmap.roadmap_notes}</p>
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              )}

              {/* Dominant Type Explanation */}
              {dominantType && (
                <AnimatedCard delay={600}>
                  <div className="card">
                    <div className="text-center mb-8">
                      <h2 className="text-heading-2 mb-2">
                        Penjelasan Tipe Dominan
                      </h2>
                      <p className="text-body">Memahami karakteristik unik kepribadian Anda</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                      <p className="text-gray-800 leading-relaxed text-lg">{dominantType.explanation}</p>
                    </div>
                  </div>
                </AnimatedCard>
              )}

              {/* Campus Activities */}
              {campusActivities && (
                <AnimatedCard delay={700}>
                  <div className="card">
                    <div className="text-center mb-8">
                      <h2 className="text-heading-2 mb-2">
                        Rekomendasi Aktivitas Kampus
                      </h2>
                      <p className="text-body">Kegiatan yang akan membantu mengembangkan potensi Anda</p>
                    </div>

                    {campusActivities.recommendations_summary && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                        <h4 className="font-semibold text-blue-800 mb-2">Ringkasan Rekomendasi</h4>
                        <p className="text-blue-700 leading-relaxed">{campusActivities.recommendations_summary}</p>
                      </div>
                    )}

                    <div className="space-y-8">
                      {/* Organizational Activities */}
                      {campusActivities.organizational_activities && campusActivities.organizational_activities.length > 0 && (
                        <div>
                          <div className="flex items-center mb-6">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-4">
                              🏛️
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Organisasi Kampus</h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            {campusActivities.organizational_activities.map((activity, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-semibold text-gray-800">{activity.activity}</h4>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    activity.commitment_level === 'High' ? 'bg-red-100 text-red-800' :
                                    activity.commitment_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {activity.commitment_level}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{activity.description}</p>
                                <div className="space-y-2">
                                  <div>
                                    <span className="font-medium text-green-800 text-sm">Manfaat:</span>
                                    <p className="text-green-700 text-sm">{activity.benefits}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-blue-800 text-sm">Relevansi:</span>
                                    <p className="text-blue-700 text-sm">{activity.relevance_to_jobs}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects & Initiatives */}
                      {campusActivities.projects_initiatives && campusActivities.projects_initiatives.length > 0 && (
                        <div>
                          <div className="flex items-center mb-6">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-4">
                              🚀
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Project & Inisiatif</h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            {campusActivities.projects_initiatives.map((activity, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-semibold text-gray-800">{activity.activity}</h4>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    activity.commitment_level === 'High' ? 'bg-red-100 text-red-800' :
                                    activity.commitment_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {activity.commitment_level}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{activity.description}</p>
                                <div className="space-y-2">
                                  <div>
                                    <span className="font-medium text-green-800 text-sm">Manfaat:</span>
                                    <p className="text-green-700 text-sm">{activity.benefits}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-blue-800 text-sm">Relevansi:</span>
                                    <p className="text-blue-700 text-sm">{activity.relevance_to_jobs}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Volunteer & Social */}
                      {campusActivities.volunteer_social && campusActivities.volunteer_social.length > 0 && (
                        <div>
                          <div className="flex items-center mb-6">
                            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white mr-4">
                              🤝
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Volunteer & Sosial</h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            {campusActivities.volunteer_social.map((activity, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-semibold text-gray-800">{activity.activity}</h4>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    activity.commitment_level === 'High' ? 'bg-red-100 text-red-800' :
                                    activity.commitment_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {activity.commitment_level}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{activity.description}</p>
                                <div className="space-y-2">
                                  <div>
                                    <span className="font-medium text-green-800 text-sm">Manfaat:</span>
                                    <p className="text-green-700 text-sm">{activity.benefits}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-blue-800 text-sm">Relevansi:</span>
                                    <p className="text-blue-700 text-sm">{activity.relevance_to_jobs}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Competitions & Events */}
                      {campusActivities.competitions_events && campusActivities.competitions_events.length > 0 && (
                        <div>
                          <div className="flex items-center mb-6">
                            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white mr-4">
                              🏆
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Kompetisi & Event</h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            {campusActivities.competitions_events.map((activity, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-semibold text-gray-800">{activity.activity}</h4>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    activity.commitment_level === 'High' ? 'bg-red-100 text-red-800' :
                                    activity.commitment_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {activity.commitment_level}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{activity.description}</p>
                                <div className="space-y-2">
                                  <div>
                                    <span className="font-medium text-green-800 text-sm">Manfaat:</span>
                                    <p className="text-green-700 text-sm">{activity.benefits}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-blue-800 text-sm">Relevansi:</span>
                                    <p className="text-blue-700 text-sm">{activity.relevance_to_jobs}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              )}

              {/* Strengths & Weaknesses */}
              {strengthsWeaknesses && (
                <AnimatedCard delay={800}>
                  <div className="card">
                    <div className="text-center mb-8">
                      <h2 className="text-heading-2 mb-2">
                        Analisis Kekuatan & Area Pengembangan
                      </h2>
                      <p className="text-body">Memahami potensi dan peluang pengembangan diri</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Strengths */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white mr-4">
                            ✅
                          </div>
                          <h3 className="text-xl font-bold text-green-700">Kekuatan Utama</h3>
                        </div>
                        <div className="space-y-4">
                          {strengthsWeaknesses.strengths?.map((strength, index) => (
                            <StrengthWeaknessCard key={index} item={strength} type="strength" />
                          ))}
                        </div>
                      </div>

                      {/* Weaknesses */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white mr-4">
                            ⚠️
                          </div>
                          <h3 className="text-xl font-bold text-orange-700">Area Pengembangan</h3>
                        </div>
                        <div className="space-y-4">
                          {strengthsWeaknesses.weaknesses?.map((weakness, index) => (
                            <StrengthWeaknessCard key={index} item={weakness} type="weakness" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CombinedResults;