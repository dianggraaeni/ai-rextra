import React from "react";
import { Target, TrendingUp, QrCode, Download } from "lucide-react";

const HowItWorksSteps = () => {
  const steps = [
    {
      icon: QrCode,
      color: "bg-gradient-to-r from-[#090B72] to-[#064ADF]",
      title: "1. Masukkan Kode Premium",
      description:
        "Gunakan kode premium yang telah dibeli untuk unlock report lengkap",
    },
    {
      icon: Target,
      color: "bg-gradient-to-r from-[#064ADF] to-[#23DCE1]",
      title: "2. Kerjakan Tes RIASEC",
      description:
        "Jawab pertanyaan tes RIASEC secara gratis dalam 15-20 menit",
    },
    {
      icon: TrendingUp,
      color: "bg-gradient-to-r from-[#090B72] to-[#23DCE1]",
      title: "3. Lihat Hasil Ringkas",
      description:
        "Dapatkan hasil analisis kepribadian dan grafik RIASEC langsung",
    },
    // {
    //   icon: QrCode,
    //   color: "bg-yellow-600",
    //   title: "3. Masukkan Kode Premium",
    //   description:
    //     "Gunakan kode premium yang telah dibeli untuk unlock report lengkap",
    // },
    {
      icon: Download,
      color: "bg-gradient-to-r from-[#064ADF] to-[#090B72]",
      title: "4. Dapatkan Report Detail",
      description:
        "Download PDF report lengkap dengan rekomendasi karier personal",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-8">
      {steps.map((step, index) => {
        const IconComponent = step.icon;
        return (
          <div
            key={index}
            className="text-center transition-all duration-1000 opacity-100 translate-y-0"
            style={{ transitionDelay: `${index * 0.2}s` }}
          >
            <div
              className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300`}
            >
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default HowItWorksSteps;
