import React from "react";

const AboutLeftContent = () => {
  return (
    <div className="transition-all duration-1000 opacity-100 translate-x-0">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">
        Apa itu <span className="bg-gradient-to-r from-[#090B72] to-[#23DCE1] bg-clip-text text-transparent">REXTRA</span>?
      </h2>

      <div className="space-y-6 text-gray-600">
        <p className="text-lg">
          REXTRA adalah platform tes psikologi karier berbasis RIASEC yang
          dirancang khusus untuk mahasiswa Indonesia. Kami membantu Anda
          menemukan arah karier yang tepat melalui analisis mendalam tentang
          kepribadian dan minat Anda.
        </p>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 text-lg">
            Masalah yang Sering Dihadapi:
          </h3>
          <ul className="text-gray-600 space-y-1 ml-4">
            <li>• Banyak mahasiswa bingung memilih jurusan atau karier</li>
            <li>• Sulit mengenali kekuatan dan kelemahan diri</li>
            <li>
              • Kurangnya panduan karier yang sesuai dengan kondisi Indonesia
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 text-lg">
            Solusi REXTRA:
          </h3>
          <p className="text-gray-600">
            Tes RIASEC + Report Karier Premium yang memberikan insight mendalam
            tentang potensi karier Anda dengan rekomendasi profesi yang sesuai.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutLeftContent;
