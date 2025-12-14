import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQItems = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const faqs = [
    {
      question: "Apa itu Tes RIASEC?",
      answer:
        "RIASEC adalah model tes kepribadian karier yang dikembangkan oleh John Holland. Tes ini mengukur 6 tipe kepribadian: Realistic, Investigative, Artistic, Social, Enterprising, dan Conventional untuk membantu Anda menemukan karier yang sesuai.",
    },
    {
      question: "Bagaimana cara membeli kode premium?",
      answer:
        'Kode premium dapat dibeli melalui Admin REXTRA. Setelah pembelian, Anda akan mendapat kode unik yang dapat digunakan untuk unlock report PDF lengkap.',
    },
    {
      question: "Apakah tes ini cocok untuk semua mahasiswa?",
      answer:
        "Ya, tes RIASEC cocok untuk semua mahasiswa dari berbagai jurusan dan universitas. Analisis yang diberikan disesuaikan dengan konteks pendidikan tinggi di Indonesia dan memberikan insight yang relevan untuk perencanaan karier mahasiswa.",
    },
    {
      question: "Apa yang saya dapatkan dalam report premium?",
      answer:
        "Report premium berisi analisis mendalam kepribadian RIASEC, grafik interaktif, rekomendasi profesi detail, skill yang perlu dikembangkan, aktivitas kampus yang direkomendasikan.",
    },
  ];

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openItems.has(index);
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300 flex items-center">
                  <HelpCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6">
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQItems;
