import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PricingCards = () => {
  const plans = [
    {
      name: "Free Plan",
      price: "Rp 0",
      subtitle: "Gratis seumur hidup",
      bgClass: "bg-white",
      shadowClass: "shadow-lg",
      borderClass: "border-2 border-gray-200",
      buttonClass: "bg-gray-400 text-gray-600 cursor-not-allowed",
      buttonText: "Coming Soon",
      buttonLink: "#",
      isDisabled: true,
      features: [
        "Tes RIASEC lengkap",
        "Hasil ringkas dengan grafik",
        "Rekomendasi profesi dasar",
      ],
      isPopular: false,
    },
    {
      name: "Premium Plan",
      price: "Rp 30.000",
      subtitle: "per kode premium",
      bgClass: "bg-gradient-to-br from-[#090B72] to-[#064ADF]",
      shadowClass: "shadow-xl",
      borderClass: "",
      buttonClass:
        "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600",
      buttonText: "Beli Kode",
      buttonLink: "/start-test",
      features: [
        "Semua fitur Free Plan",
        "Report PDF detail lengkap",
        "Export PDF per kode",
        "Insight khusus mahasiswa",
        "QR code verifikasi",
      ],
      isPopular: true,
    },
    {
      name: "Bundle Plan",
      price: "10 kode: Rp 250.000",
      subtitle: "100 kode: Rp 1.800.000",
      description: "Hemat hingga 40%",
      bgClass: "bg-white",
      shadowClass: "shadow-lg",
      borderClass: "border-2 border-gray-200",
      buttonClass: "bg-gradient-to-r from-[#064ADF] to-[#23DCE1] text-white hover:from-[#090B72] hover:to-[#064ADF]",
      buttonText: "Beli Bundle",
      buttonLink: "/start-test",
      features: [
        "Semua fitur Premium",
        "Harga lebih hemat",
        "Cocok untuk kampus/organisasi",
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {plans.map((plan, index) => (
        <div
          key={index}
          className={`${plan.bgClass} rounded-2xl ${plan.shadowClass} p-8 ${
            plan.borderClass
          } relative transition-all duration-1000 hover:shadow-2xl ${
            plan.isPopular ? "transform scale-105" : ""
          } opacity-100 translate-y-0`}
          style={{ transitionDelay: `${index * 0.2}s` }}
        >
          {plan.isPopular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                MOST POPULAR
              </span>
            </div>
          )}

          <div className="text-center mb-6">
            <h3
              className={`text-2xl font-bold mb-2 ${
                plan.isPopular ? "text-white" : "text-gray-900"
              }`}
            >
              {plan.name}
            </h3>
            <div
              className={`text-4xl font-bold mb-2 ${
                plan.isPopular ? "text-white" : "text-gray-900"
              }`}
            >
              {plan.price}
            </div>
            <p className={plan.isPopular ? "text-white/80" : "text-gray-600"}>
              {plan.subtitle}
            </p>
            {plan.description && (
              <p className="text-gray-600 mt-2">{plan.description}</p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            {plan.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center">
                <CheckCircle
                  className={`w-5 h-5 mr-3 ${
                    plan.isPopular ? "text-yellow-400" : "text-green-500"
                  }`}
                />
                <span className={plan.isPopular ? "text-white" : ""}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {plan.buttonLink.startsWith("http") ? (
            <a
              href={plan.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full ${plan.buttonClass} font-bold py-3 px-6 rounded-xl text-center block transition-all duration-300 ${
                plan.isDisabled ? '' : 'transform hover:scale-105'
              }`}
              style={plan.isDisabled ? { pointerEvents: 'none' } : {}}
            >
              {plan.buttonText}
            </a>
          ) : (
            <Link
              to={plan.isDisabled ? "#" : plan.buttonLink}
              className={`w-full ${plan.buttonClass} font-bold py-3 px-6 rounded-xl text-center block transition-all duration-300 ${
                plan.isDisabled ? '' : 'transform hover:scale-105'
              }`}
              style={plan.isDisabled ? { pointerEvents: 'none' } : {}}
            >
              {plan.buttonText}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default PricingCards;
