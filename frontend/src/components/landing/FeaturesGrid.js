import React from "react";
import {
  Target,
  TrendingUp,
  FileText,
  Lightbulb,
  QrCode,
  Shield,
} from "lucide-react";

const FeaturesGrid = () => {
  const features = [
    {
      icon: Target,
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      iconBg: "bg-gradient-to-r from-[#090B72] to-[#064ADF]",
      title: "Tes RIASEC Berbasis Web",
      description:
        "Akses tes RIASEC kapan saja melalui browser tanpa perlu install aplikasi",
    },
    {
      icon: TrendingUp,
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      iconBg: "bg-gradient-to-r from-[#064ADF] to-[#23DCE1]",
      title: "Hasil Ringkas Gratis",
      description:
        "Dapatkan analisis dasar dan grafik RIASEC secara gratis setelah menyelesaikan tes",
    },
    {
      icon: FileText,
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      iconBg: "bg-gradient-to-r from-[#090B72] to-[#23DCE1]",
      title: "Premium Report Detail",
      description:
        "Report PDF lengkap dengan kode premium yang dibeli",
    },
    {
      icon: Lightbulb,
      gradient: "from-yellow-50 to-orange-50",
      border: "border-yellow-100",
      iconBg: "bg-yellow-600",
      title: "Insight Khusus Mahasiswa",
      description:
        "Rekomendasi skill, aktivitas kampus, dan arah karier yang relevan untuk mahasiswa",
    },
    {
      icon: QrCode,
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      iconBg: "bg-gradient-to-r from-[#090B72] to-[#23DCE1]",
      title: "QR Code Verifikasi",
      description:
        "Setiap report dilengkapi QR code untuk verifikasi keaslian dan keamanan",
    },
    {
      icon: Shield,
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-100",
      iconBg: "bg-gradient-to-r from-[#064ADF] to-[#23DCE1]",
      title: "Data Privacy Terjamin",
      description:
        "Data Anda aman dan tidak akan dibagikan ke pihak ketiga tanpa izin",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-xl border ${feature.border} hover:shadow-xl transition-all duration-500 hover:-translate-y-2 opacity-100 translate-y-0`}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div
              className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300`}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturesGrid;
