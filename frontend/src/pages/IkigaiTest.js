import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Komponen untuk loading spinner (bisa dipisah ke file sendiri)
const Spinner = ({ size = "8" }) => (
  <svg
    className={`animate-spin h-${size} w-${size} text-blue-600`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const IkigaiTest = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- LOGIKA KOMPONEN TETAP SAMA ---
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/assessment/start")
      .then((response) => {
        const ikigaiQuestions = response.data.ikigai_questions || [];
        setQuestions(ikigaiQuestions);
        const initialAnswers = {};
        ikigaiQuestions.forEach((q) => {
          initialAnswers[q.dimension] = {
            choices: [],
            reason: "",
            alternative: "",
          };
        });
        setAnswers(initialAnswers);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error ||
            "Gagal memulai tes IKIGAI. Harap selesaikan tes RIASEC terlebih dahulu."
        );
        setLoading(false);
      });
  }, []);

  const handleCheckboxChange = (dimension, option) => {
    setAnswers((prev) => {
      const currentChoices = prev[dimension].choices;
      let newChoices;
      if (currentChoices.includes(option)) {
        newChoices = currentChoices.filter((item) => item !== option);
      } else {
        newChoices = [...currentChoices, option].slice(0, 2);
      }
      return {
        ...prev,
        [dimension]: { ...prev[dimension], choices: newChoices },
      };
    });
  };

  const handleTextChange = (dimension, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [dimension]: { ...prev[dimension], [field]: value },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    for (const key in answers) {
      const answer = answers[key];
      const hasChoices = answer.choices.length > 0;
      const hasReason = answer.reason.trim() !== "";
      const hasAlternative = answer.alternative.trim() !== "";

      if (hasChoices && !hasReason) {
        setError(`Harap isi alasan untuk pilihan Anda di dimensi "${key}".`);
        return;
      }
      if (!hasChoices && !hasAlternative) {
        setError(
          `Jika tidak ada yang cocok, harap tuliskan alternatif untuk dimensi "${key}".`
        );
        return;
      }
    }
    setError("");
    setSubmitting(true);
    axios
      .post("/api/assessment/submit", { answers })
      .then((response) => {
        const { hash } = response.data;
        navigate(`/result/${hash}`);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error ||
            "Gagal mengirim jawaban. Silakan coba lagi."
        );
        setSubmitting(false);
      });
  };
  // --- END LOGIKA KOMPONEN ---

  // Tampilan Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Spinner size="12" />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Memuat Tes IKIGAI...
        </p>
      </div>
    );
  }

  // Tampilan Utama
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
        <div className="page-container pt-16 md:pt-20">
          <div className="page-content">
            <div className="card">
              <div className="text-center mb-8">
                <h1 className="text-heading-1">Tes IKIGAI</h1>
                <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
                  Tes ini bertujuan membantu menemukan profesi yang paling
                  sesuai. Tidak ada jawaban benar atau salah.
                </p>
              </div>

              {error && (
                <div className="alert-error mb-6" role="alert">
                  <p className="font-bold">Terjadi Kesalahan</p>
                  <p>{error}</p>
                </div>
              )}

              {questions.length > 0 ? (
                <form onSubmit={handleSubmit}>
                  <div className="section-spacing">
                    {questions.map((q) => (
                      <div
                        key={q.dimension}
                        className="card-compact border border-gray-200 rounded-lg transition-shadow hover:shadow-md"
                      >
                        <fieldset>
                          <legend className="text-xl font-semibold text-gray-800 mb-5">
                            {q.instruction}
                          </legend>

                          <div className="space-y-4">
                            {q.options.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50"
                              >
                                <input
                                  type="checkbox"
                                  className="form-checkbox"
                                  checked={answers[
                                    q.dimension
                                  ]?.choices.includes(option)}
                                  onChange={() =>
                                    handleCheckboxChange(q.dimension, option)
                                  }
                                  disabled={
                                    answers[q.dimension]?.choices.length >= 2 &&
                                    !answers[q.dimension]?.choices.includes(
                                      option
                                    )
                                  }
                                />
                                <span className="text-gray-700 select-none">
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>

                          <div className="mt-6">
                            <textarea
                              className="form-textarea"
                              rows="3"
                              placeholder={
                                answers[q.dimension]?.choices.length > 0
                                  ? "Jelaskan mengapa pilihan ini sesuai dengan Anda..."
                                  : "Tidak ada yang cocok? Tuliskan preferensi ideal Anda di sini..."
                              }
                              value={
                                answers[q.dimension]?.choices.length > 0
                                  ? answers[q.dimension]?.reason || ""
                                  : answers[q.dimension]?.alternative || ""
                              }
                              onChange={(e) =>
                                handleTextChange(
                                  q.dimension,
                                  answers[q.dimension]?.choices.length > 0
                                    ? "reason"
                                    : "alternative",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                        </fieldset>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 text-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary"
                    >
                      {submitting ? (
                        <>
                          <Spinner size="5" />
                          <span className="ml-3">Memproses...</span>
                        </>
                      ) : (
                        "Selesai & Lihat Hasil Analisis"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                !loading && (
                  <p className="text-center text-gray-500">
                    Gagal memuat data asesmen.
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IkigaiTest;
