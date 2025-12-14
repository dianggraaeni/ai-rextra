import React from "react";
import { Star } from "lucide-react";

const TestimonialsGrid = () => {
  const testimonials = [
    {
      initial: "S",
      name: "Sarah, Mahasiswa Teknik",
      university: "Universitas Indonesia",
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      avatarBg: "bg-gradient-to-r from-[#090B72] to-[#064ADF]",
      text: "Report ini membantu saya tahu skill yang harus saya kembangkan di kampus. Sekarang saya lebih fokus dengan aktivitas yang benar-benar bermanfaat untuk karier saya.",
    },
    {
      initial: "A",
      name: "Ahmad, Mahasiswa Ekonomi",
      university: "Universitas Gadjah Mada",
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      avatarBg: "bg-gradient-to-r from-[#090B72] to-[#23DCE1]",
      text: "Dari hasil RIASEC, saya baru sadar kalau minat saya lebih ke Investigative. Sekarang saya sedang mempersiapkan diri untuk melanjutkan S2 di bidang research.",
    },
    {
      initial: "M",
      name: "Maya, Mahasiswa Psikologi",
      university: "Universitas Airlangga",
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      avatarBg: "bg-gradient-to-r from-[#064ADF] to-[#23DCE1]",
      text: "Sebagai mahasiswa psikologi, tes RIASEC ini sangat membantu saya memahami diri sendiri. Hasilnya cocok dengan passion saya di bidang sosial dan membantu saya memilih spesialisasi yang tepat.",
    },
    {
      initial: "R",
      name: "Rizki, Mahasiswa Informatika",
      university: "Institut Teknologi Bandung",
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      avatarBg: "bg-gradient-to-r from-[#064ADF] to-[#23DCE1]",
      text: "Hasil tes menunjukkan saya tipe Investigative yang kuat. Sekarang saya tahu kenapa saya suka programming dan problem solving. Report lengkapnya sangat detail dan bermanfaat!",
    },
    {
      initial: "D",
      name: "Diana, Mahasiswa Desain",
      university: "Universitas Trisakti",
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      avatarBg: "bg-gradient-to-r from-[#090B72] to-[#23DCE1]",
      text: "Tipe Artistic saya sangat dominan! Tes ini membantu saya memahami kenapa saya suka berkreasi. Insight tentang skill yang perlu dikembangkan sangat akurat dan membantu perencanaan karier saya.",
    },
    {
      initial: "B",
      name: "Budi, Mahasiswa Akuntansi",
      university: "Universitas Diponegoro",
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      avatarBg: "bg-gradient-to-r from-[#090B72] to-[#23DCE1]",
      text: "Hasil Conventional saya sangat tinggi, cocok dengan bidang akuntansi yang saya tekuni. Report premium memberikan rekomendasi skill yang sangat relevan untuk karir di dunia finance.",
    },
  ];

  // Duplicate testimonials for seamless scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-left">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.initial}-${index}`}
              className="flex-shrink-0 w-80 mx-4"
            >
              <div
                className={`bg-gradient-to-br ${testimonial.gradient} p-6 rounded-2xl border ${testimonial.border} hover:shadow-xl transition-all duration-1000 hover:-translate-y-2 h-full`}
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 ${testimonial.avatarBg} rounded-full flex items-center justify-center mr-4 hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-white font-bold">
                      {testimonial.initial}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.university}
                    </div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current hover:scale-110 transition-transform duration-200"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic text-sm leading-relaxed">"{testimonial.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TestimonialsGrid;
