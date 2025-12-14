import React, { useState } from "react";
import { X } from "lucide-react";

const AboutRightContent = () => {
  const [selectedType, setSelectedType] = useState(null);

  const riasecDetails = {
    Realistic: {
      title: "Realistic (R)",
      description: "Orang dengan tipe Realistic cenderung praktis, suka bekerja dengan tangan, dan lebih memilih aktivitas yang melibatkan benda atau mesin daripada orang.",
      characteristics: [
        "Praktis dan hands-on",
        "Suka bekerja dengan mesin, alat, atau hewan",
        "Lebih suka aktivitas fisik daripada teoritis",
        "Memiliki keterampilan mekanik yang baik",
        "Sering memilih karir di bidang teknik, pertanian, atau perdagangan"
      ],
      careers: ["Insinyur", "Teknisi", "Mekanik", "Petani", "Pilot", "Arsitek"]
    },
    Investigative: {
      title: "Investigative (I)",
      description: "Orang dengan tipe Investigative suka mengamati, belajar, menyelidiki, dan memecahkan masalah. Mereka tertarik pada pengetahuan ilmiah dan intelektual.",
      characteristics: [
        "Analitis dan logis",
        "Suka memecahkan masalah kompleks",
        "Tertarik pada penelitian dan eksperimen",
        "Memiliki kemampuan matematika dan sains yang baik",
        "Lebih suka bekerja mandiri daripada berkelompok"
      ],
      careers: ["Dokter", "Peneliti", "Ilmuwan", "Programmer", "Analis Data", "Guru Fisika/Matematika"]
    },
    Artistic: {
      title: "Artistic (A)",
      description: "Orang dengan tipe Artistic kreatif, imajinatif, dan ekspresif. Mereka suka bekerja dengan ide-ide baru dan bentuk-bentuk estetika.",
      characteristics: [
        "Kreatif dan imajinatif",
        "Suka mengekspresikan diri melalui seni",
        "Tertarik pada musik, seni rupa, dan sastra",
        "Memiliki kemampuan intuisi yang tinggi",
        "Lebih suka lingkungan yang bebas dan fleksibel"
      ],
      careers: ["Seniman", "Desainer", "Penulis", "Musisi", "Fotografer", "Arsitek Interior"]
    },
    Social: {
      title: "Social (S)",
      description: "Orang dengan tipe Social suka membantu orang lain, mengajar, dan bekerja dalam lingkungan sosial. Mereka peduli dengan kesejahteraan orang lain.",
      characteristics: [
        "Peduli dan empati terhadap orang lain",
        "Suka mengajar dan membantu orang",
        "Memiliki kemampuan komunikasi interpersonal yang baik",
        "Tertarik pada masalah sosial dan kemanusiaan",
        "Lebih suka bekerja dalam tim daripada sendirian"
      ],
      careers: ["Guru", "Konselor", "Psikolog", "Pekerja Sosial", "Dokter", "Perawat"]
    },
    Enterprising: {
      title: "Enterprising (E)",
      description: "Orang dengan tipe Enterprising suka memimpin, meyakinkan orang lain, dan mencapai tujuan melalui interaksi sosial. Mereka memiliki ambisi dan energi tinggi.",
      characteristics: [
        "Ambisius dan energik",
        "Suka memimpin dan memotivasi orang lain",
        "Memiliki kemampuan persuasi yang baik",
        "Tertarik pada bisnis dan entrepreneurship",
        "Lebih suka tantangan dan risiko"
      ],
      careers: ["Manager", "Sales Executive", "Politikus", "Entrepreneur", "Marketing Manager", "Banker"]
    },
    Conventional: {
      title: "Conventional (C)",
      description: "Orang dengan tipe Conventional suka bekerja dengan data, aturan, dan prosedur yang terorganisir. Mereka efisien dan akurat dalam pekerjaan administratif.",
      characteristics: [
        "Terorganisir dan sistematis",
        "Suka bekerja dengan data dan angka",
        "Memiliki perhatian terhadap detail",
        "Lebih suka rutinitas dan struktur",
        "Efisien dalam pekerjaan administratif"
      ],
      careers: ["Akuntan", "Sekretaris", "Auditor", "Bank Teller", "Office Manager", "Data Entry Specialist"]
    }
  };

  return (
    <div className="text-center transition-all duration-1000 delay-300 opacity-100 translate-x-0">
      <div className="grid grid-cols-2 gap-4">
        {[
          { type: "Realistic", color: "bg-gradient-to-r from-[#090B72] to-[#064ADF]" },
          { type: "Investigative", color: "bg-gradient-to-r from-[#064ADF] to-[#23DCE1]" },
          { type: "Artistic", color: "bg-gradient-to-r from-[#090B72] to-[#23DCE1]" },
          { type: "Social", color: "bg-gradient-to-r from-[#064ADF] to-[#090B72]" },
          { type: "Enterprising", color: "bg-gradient-to-r from-[#23DCE1] to-[#064ADF]" },
          { type: "Conventional", color: "bg-gradient-to-r from-[#090B72] to-[#064ADF]" },
        ].map((item, index) => (
          <div
            key={index}
            className={`${item.color} text-white p-4 rounded-lg shadow-lg hover:transform hover:scale-105 transition-all duration-300 animate-fade-in cursor-pointer`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedType(item.type)}
          >
            <div className="font-semibold text-sm">{item.type}</div>
          </div>
        ))}
      </div>
      <p className="text-gray-600 mt-6 text-sm">
        6 Tipe Kepribadian RIASEC yang akan membantu Anda memahami diri sendiri
      </p>

      {/* Modal */}
      {selectedType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {riasecDetails[selectedType].title}
                </h3>
                <button
                  onClick={() => setSelectedType(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {riasecDetails[selectedType].description}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Karakteristik Utama:
                  </h4>
                  <ul className="space-y-2">
                    {riasecDetails[selectedType].characteristics.map((char, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Contoh Karier:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {riasecDetails[selectedType].careers.map((career, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedType(null)}
                  className="w-full bg-gradient-to-r from-[#064ADF] to-[#23DCE1] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#090B72] hover:to-[#064ADF] transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutRightContent;
