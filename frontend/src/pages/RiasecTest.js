import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Skala definisi dari backend untuk tampilan
const SCALE_DEFINITIONS = {
  Minat: {
    1: "Tidak Tertarik",
    2: "Kurang Tertarik",
    3: "Netral",
    4: "Tertarik",
    5: "Sangat Tertarik",
  },
  "Kepercayaan Diri": {
    1: "Tidak Yakin",
    2: "Kurang Yakin",
    3: "Ragu-ragu",
    4: "Yakin",
    5: "Sangat Yakin",
  },
  Frekuensi: {
    1: "Tidak Pernah",
    2: "Jarang",
    3: "Kadang-kadang",
    4: "Sering",
    5: "Sangat Sering",
  },
};

const QUESTIONS_PER_PAGE = 12;

// Komponen Spinner yang bisa digunakan kembali
const Spinner = ({ size = "8", color = "text-blue-600" }) => (
  <svg
    className={`animate-spin h-${size} w-${size} ${color}`}
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

const RiasecTest = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/riasec/questions")
      .then((response) => {
        setAllQuestions(response.data);
        const initialAnswers = {};
        response.data.forEach((q) => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat pertanyaan. Silakan muat ulang halaman.");
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(allQuestions.length / QUESTIONS_PER_PAGE);
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = allQuestions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );
  const isPageComplete = currentQuestions.every((q) => answers[q.id] !== null);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: parseInt(value) }));
    setError("");
  };

  const handleNextPage = () => {
    if (!isPageComplete) {
      setError(
        "Harap jawab semua pertanyaan di halaman ini sebelum melanjutkan."
      );
      return;
    }
    setError("");
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    if (!isPageComplete) {
      setError(
        "Harap jawab semua pertanyaan di halaman ini sebelum menyelesaikan tes."
      );
      return;
    }
    setError("");
    setSubmitting(true);
    const orderedAnswers = allQuestions.map((q) => answers[q.id]);
    axios
      .post("/api/riasec/submit", { answers: orderedAnswers })
      .then(() => {
        navigate("/assessment");
      })
      .catch((err) => {
        setError(
          err.response?.data?.error ||
            "Gagal mengirim jawaban. Silakan coba lagi."
        );
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Spinner size="12" color="text-blue-600" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">
          Memuat Tes...
        </h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
  <div className="page-container pt-16 md:pt-20">
          <main className="page-content">
            <div className="card">
              <div className="text-center mb-6">
                <h1 className="text-heading-1">Tes Kepribadian RIASEC</h1>
                {totalPages > 0 && (
                  <p className="mt-3 text-lg text-gray-600">
                    Halaman{" "}
                    <span className="font-bold text-blue-600">
                      {currentPage}
                    </span>{" "}
                    dari {totalPages}
                  </p>
                )}
              </div>

              <div className="progress-bar mb-8">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {error && (
                <div className="alert-error mb-6" role="alert">
                  <p>{error}</p>
                </div>
              )}

              <div className="card-spacing">
                {currentQuestions.map((q, index) => (
                  <div key={q.id} className="card-compact flex flex-col">
                    <p className="text-gray-600 font-semibold mb-1">
                      {startIndex + index + 1}.{" "}
                      <span className="italic">(Skala: {q.skala})</span>
                    </p>
                    <p
                      className="text-gray-800 text-lg flex-grow mb-4"
                      style={{ minHeight: "3.5rem" }}
                    >
                      {q.pertanyaan}
                    </p>

                    <fieldset>
                      <legend className="sr-only">
                        Pilihan untuk pertanyaan {q.id}
                      </legend>
                      <div className="flex justify-between items-start pt-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label
                            key={val}
                            className="flex flex-col items-center space-y-2 cursor-pointer w-1/5 px-1 text-center"
                          >
                            <span className="text-xs sm:text-sm text-gray-500 leading-tight">
                              {SCALE_DEFINITIONS[q.skala][val]}
                            </span>
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={val}
                              checked={answers[q.id] === val}
                              onChange={(e) =>
                                handleAnswerChange(q.id, e.target.value)
                              }
                              className="form-radio"
                            />
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                {currentPage < totalPages ? (
                  <button
                    onClick={handleNextPage}
                    disabled={!isPageComplete || submitting}
                    className="btn-primary"
                  >
                    Lanjut
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isPageComplete || submitting}
                    className="btn-primary"
                  >
                    {submitting ? (
                      <>
                        <Spinner size="5" color="text-white" />
                        <span className="ml-2">Memproses...</span>
                      </>
                    ) : (
                      "Selesai & Lihat Hasil"
                    )}
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default RiasecTest;
