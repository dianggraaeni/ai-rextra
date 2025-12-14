import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Instagram,
  ShoppingCart,
  User,
  Heart,
  BookOpen,
  Compass,
  FolderOpen,
  Trophy,
  Briefcase,
  ChevronUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import {
  FAQHeader,
  FAQItems,
  FinalCTAContent,
  Pattern,
  TestimonialsGrid,
  TestimonialsHeader,
} from "../components/landing";

// Custom hook for scroll animations
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

function LandingPage() {
  const [heroRef, heroVisible] = useScrollAnimation(0.3);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll event for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash navigation from other pages
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Remove the # from hash
      const sectionId = hash.substring(1);
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style jsx>{`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        .hero-title {
          font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          font-weight: 600;
          font-style: normal;
          font-size: 36px;
          line-height: 120%;
          text-align: center;
          margin: 0;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 64px;
          }
        }

        .hero-subtitle {
          font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          font-weight: 400;
          font-style: normal;
          font-size: 18px;
          line-height: 150%;
          text-align: center;
          margin: 0;
        }

        @media (min-width: 768px) {
          .hero-subtitle {
            font-size: 28px;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out forwards;
        }

        .sponsors-heading {
          font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          font-weight: 600;
          font-style: normal;
          font-size: 30.87px;
          line-height: 41.16px;
          text-align: center;
          margin: 0 0 12px 0;
          color: #4B5563; /* updated per request */
        }
        .poppins-medium {
          font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          font-weight: 500;
          font-style: normal;
          font-size: 20.58px;
          line-height: 100%;
          letter-spacing: 0%;
          text-align: justify;
          color: inherit;
        }
        .poppins-regular {
          font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          font-weight: 400;
          font-style: normal;
          font-size: 20.58px;
          line-height: 100%;
          letter-spacing: 0%;
          text-align: justify;
          color: inherit;
        }
        @media (max-width: 767px) {
          .sponsors-heading {
            font-size: 18px;
            line-height: 24px;
          }
        }
      `}</style>

  {/* Hero Section */}
  <section className="min-h-screen relative overflow-hidden pt-20 md:pt-0">
        <Navbar floating />
        <Pattern />
        {/* Decorations at screen corners (hidden on small screens) */}
        <img
          src="/hiasan_kiri.svg"
          alt=""
          className="hidden md:block absolute left-10 top-[40%] transform -translate-y-[55%] -translate-x-12 w-80 lg:w-96 xl:w-[30rem] pointer-events-none"
        />
        <img
          src="/hiasan_kanan.svg"
          alt=""
          className="hidden md:block absolute right-10 top-14 transform translate-x-12 w-64 lg:w-80 xl:w-96 pointer-events-none"
        />
        <div
          ref={heroRef}
          className={`relative z-10 container mx-auto px-4 py-4 md:py-8 transition-all duration-1000 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center text-center gap-4 md:gap-6 mt-24 md:mt-32">
            <div className="w-full md:max-w-5xl mx-auto px-2 md:px-4">
              <h1 className="hero-title text-white mb-4 md:mb-6 z-4">
                <span className="block md:inline md:whitespace-nowrap">Unlock Your Digital Career </span>
                <span className="block">Path with REXTRA</span>
              </h1>

              <p className="hero-subtitle text-cyan-100 mb-6 md:mb-8 pt-2 md:pt-4 px-2">
                Mendukung Mahasiswa Indonesia Menjadi Talenta<br className="hidden md:block"/> Digital Siap Kerja dengan Teknologi AI
              </p>

              <div className="flex justify-center pt-4 md:pt-6">
                <Link
                  to="/start-test"
                  className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-full text-lg shadow-md inline-flex items-center gap-3"
                >
                  Mulai eksplorasi
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              {/* Bottom mockup + mascot (moved to section bottom) */}
            </div>
          </div>
        </div>

        {/* Mockup (flush to hero bottom) */}
        <img
          src="/mockup.svg"
          alt="mockup"
          className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-full sm:w-4/5 md:w-3/5 lg:w-3/5 xl:w-2/5 opacity-100 z-0 pointer-events-none"
        />
        {/* Mascot in front of mockup (slightly above bottom) */}
        <img
          src="/maskot.svg"
          alt="maskot"
          className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[24rem] sm:w-[32rem] md:w-[48rem] lg:w-[80rem] xl:w-[96rem] pointer-events-none"
        />

        {/* Scroll Indicator removed per design request */}
      </section>

      {/* Sponsors Section */}
      {/*
      
      <section id="sponsors" className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-4">
            <h2 className="sponsors-heading">Di percaya & Di dukung oleh</h2>
          </div>

          <div className="flex items-center justify-center gap-6">
            <img
              src="/sponsor.svg"
              alt="Sponsor"
              className="h-10 md:h-14 lg:h-16 opacity-90"
            />
          </div>
        </div>
      </section> 

      */}

      {/* Team / About Cards Section - single bordered container - COMMENTED OUT
      <section id="about-cards" className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div
            className="rounded-3xl p-[1.5px]"
          >
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                <div className="md:col-span-3 p-[1px] rounded-2xl" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
                  <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm flex items-center">
                    <div className="flex flex-col md:flex-row items-center gap-6 my-3">
                      <img
                        src="/foto_tim.svg"
                        alt="Tim REXTRA"
                        className="w-full md:w-70 h-56 md:h-48 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">Tim REXTRA</h3>
                        <p className="text-gray-600 mt-2 poppins-regular">Kolaborasi lintas disiplin untuk solusi karier digital berbasis AI.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 p-[1px] rounded-2xl" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
                  <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex flex-col justify-center h-full">
                    <p className="text-gray-800 poppins-regular my-4">
                      REXTRA adalah startup teknologi pendidikan yang berfokus pada layanan rekomendasi persiapan karier digital berbasis Artificial Intelligence (AI) untuk mahasiswa.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2 p-[1px] rounded-2xl" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
                  <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex flex-col justify-center h-full">
                    <div className="my-4">
                      <h4 className="text-lg md:text-xl font-bold mb-2 text-gray-900">Visi REXTRA:</h4>
                      <p className="text-gray-600 poppins-regular">Memberdayakan jutaan mahasiswa menjadi talenta digital yang unggul, kompeten, dan siap bersaing dalam meraih tujuan karier di era ekonomi digital.</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 p-[1px] rounded-2xl" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
                  <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex flex-col justify-center h-full">
                    <div className="my-4">
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">Misi REXTRA:</h4>
                      <ul className="space-y-3 poppins-regular text-gray-600">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Mengembangkan aplikasi mobile sebagai produk utama yang memberikan rekomendasi persiapan karier digital sesuai kebutuhan mahasiswa.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Menyediakan edukasi persiapan karier digital melalui konten media sosial dan acara interaktif.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Berkolaborasi dengan pakar dan institusi pendidikan dalam pengembangan konten serta inovasi berbasis riset.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Product image only section (added as requested) */}
      <section id="product" className="h-screen bg-white">
        <div className="container mx-auto px-6 h-full">
          <div className="flex items-center justify-center h-full">
            <picture className="w-full">
              <source media="(max-width: 767px)" srcSet="/product_mobile.svg" />
              <img src="/product.svg" alt="product" className="w-full max-w-7xl mx-auto object-contain" />
            </picture>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Fitur Unggulan Aplikasi REXTRA</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase">Persona REXTRA</h3>
                  <p className="text-white mt-2 text-sm">Rekomendasi kebutuhan persiapan karier digital terpersonalisasi.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase">Kenali Diri</h3>
                  <p className="text-white mt-2 text-sm">Tes RIASEC & IKIGAI untuk menemukan profesi digital yang sesuai.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase">Kamus Karir</h3>
                  <p className="text-white mt-2 text-sm">Katalog profesi digital dan jenjang karier terlengkap.</p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase">Eksplorasi</h3>
                  <p className="text-white mt-2 text-sm">Rekomendasi kegiatan dan aktivitas untuk membangun portofolio relevan.</p>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase">Portofolio</h3>
                  <p className="text-white mt-2 text-sm">Pencatatan dan pemantauan progres kegiatan untuk portofolio karier digital.</p>
                </div>
              </div>
            </div>

            {/* Card 6 */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase">Jadi Ambis</h3>
                  <p className="text-white mt-2 text-sm">Gamifikasi pencapaian rencana karier untuk meningkatkan motivasi belajar.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Karir Lab card */}
          <div className="flex justify-center mt-10">
            <div className="max-w-xl w-full p-6 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(90deg, #090B72 0%, #064ADF 50%, #23DCE1 100%)' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase">Karir Lab</h3>
                  <p className="text-white mt-2 text-sm">Layanan persiapan seleksi dan simulasi rekrutmen kerja.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REXTRA Community Section */}
      <section id="community" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Centered heading */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                REXTRA Community
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                Memberdayakan Generasi Muda untuk Siap Berkarier di Dunia Digital
              </h3>
            </div>

            {/* Main content box with image and text inline */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              {/* Left image outside the box */}
              <div className="flex-shrink-0">
                <img
                  src="/info.svg"
                  alt="REXTRA Community Info"
                  className="w-24 h-24 md:w-32 md:h-32 object-contain"
                />
              </div>

              {/* Right box */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 flex-1">
                <p className="text-gray-700 leading-relaxed text-justify">
                  Komunitas REXTRA adalah wadah bagi mahasiswa dan fresh graduate untuk 
                  mengembangkan potensi diri di dunia karier digital. Melalui berbagai kegiatan interaktif, 
                  kelas pengembangan diri, dan mentoring bersama praktisi profesional, anggota komunitas 
                  dapat belajar menyusun rencana karier, membangun portofolio profesional, serta 
                  mempersiapkan diri menghadapi dunia kerja dengan lebih percaya diri.
                </p>
              </div>
            </div>

            {/* Bottom content box */}
            <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
              <p className="text-gray-700 leading-relaxed text-center">
                <span className="font-semibold">Bergabunglah bersama 515+ anggota aktif</span> untuk berbagi pengalaman, mendapatkan insight karier, 
                serta memperluas jaringan profesionalmu di bidang teknologi, bisnis, dan kreatif. 🚀
              </p>
            </div>

            {/* Centered button */}
            <div className="flex justify-center mt-8">
              <button className="bg-gradient-to-r from-[#090B72] via-[#064ADF] to-[#23DCE1] text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 inline-flex items-center gap-3">
                Klik untuk gabung komunitas
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* REXTRA CLUB Section (new) */}
      <section id="rextra-club" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
            {/* Left: text */}
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">REXTRA CLUB</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Bangun karier digitalmu dari sekarang bersama REXTRA CLUB, ruang belajar interaktif yang dirancang untuk membantu
                mahasiswa dan talenta muda menemukan arah karier yang paling sesuai dengan potensinya.
              </p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                Melalui fitur REXTRA Club, kamu bisa menikmati pengalaman eksklusif untuk menjelajahi berbagai fitur unggulan REXTRA
                sebelum versi penuh aplikasi diluncurkan. Dapatkan panduan karier yang komprehensif, hasil tes kepribadian digital, serta
                rekomendasi profesi yang disesuaikan dengan keahlian dan minatmu.
              </p>

              {/* <div className="flex">
                <button className="bg-gradient-to-r from-[#090B72] via-[#064ADF] to-[#23DCE1] text-white font-semibold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 inline-flex items-center gap-3">
                  Klik untuk gabung
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div> */}
            </div>

            {/* Right: single full-size image */}
            <div className="md:w-1/2 flex items-center">
              <div className="w-full rounded-2xl shadow-sm bg-white overflow-hidden flex items-center justify-center min-h-[14rem] md:min-h-[20rem] max-h-[28rem] p-4">
                <img src="/community.png" alt="community" className="w-auto max-w-full h-auto max-h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <TestimonialsHeader />
          <TestimonialsGrid />
        </div>
      </section>

            {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <FAQHeader />
          <FAQItems />
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        id="get-started"
        className="py-20 bg-gradient-to-r from-[#090B72] via-[#064ADF] to-[#23DCE1]"
      >
        <FinalCTAContent />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/logo.svg"
                  alt="REXTRA Logo"
                  className="w-40 rounded-lg"
                />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Platform tes psikologi karier RIASEC untuk mahasiswa Indonesia.
                Temukan arah karier Anda dengan analisis mendalam dan
                rekomendasi personal.
              </p>
              <div className="flex space-x-4">
                <a
                  href="mailto:contact@rextra.id"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/rextra.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://shopee.co.id/rextra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('about-cards')}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('community')}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    Community
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: contact@rextra.id</p>
                <p>Instagram: @rextra.id</p>
                <p>Shopee: REXTRA Official</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 REXTRA. All rights reserved. Made with ❤️ for Indonesian
              students.
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#090B72] via-[#064ADF] to-[#23DCE1] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}

export default LandingPage;