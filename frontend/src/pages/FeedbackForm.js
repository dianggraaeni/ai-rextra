import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const FeedbackForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultsData } = location.state || {};
  const recommendations = resultsData?.results?.analysis || [];

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    usia: "",
    program_studi: "",
    profesi_saat_ini: "",
    rekomendasi_sesuai: {},
    penjelasan_rekomendasi: "",
    skala_kepuasan: "",
    saran_masukan: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      rekomendasi_sesuai: {
        ...prev.rekomendasi_sesuai,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const feedbackPayload = {
      ...formData,
      rekomendasi_sesuai: Object.keys(formData.rekomendasi_sesuai).filter(
        (key) => formData.rekomendasi_sesuai[key]
      ),
    };

    setLoading(true);
    axios
      .post("/api/feedback", feedbackPayload)
      .then(() => {
        setSuccess(
          "Terima kasih! Feedback Anda telah terkirim. Anda akan dialihkan ke halaman utama."
        );
        setTimeout(() => navigate("/"), 3000);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error ||
            "Gagal mengirim feedback. Silakan coba lagi."
        );
        setLoading(false);
      });
  };

  if (!resultsData) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl text-red-600 mb-4">
          Data hasil tidak ditemukan untuk memberikan feedback.
        </h1>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-[#064ADF] to-[#23DCE1] text-white px-6 py-2 rounded-lg hover:from-[#090B72] hover:to-[#064ADF] transition-colors"
        >
          Kembali ke Tes
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#090B72] via-[#064ADF] to-[#23DCE1]">
        <div className="page-container">
          <div className="page-content">
            <div className="card">
              <div className="text-center mb-8">
                <h1 className="text-heading-1">Form Feedback Pengujian</h1>
                <h2 className="text-heading-3 text-blue-600 mt-2">
                  REXTRA - KENALI DIRI
                </h2>
              </div>

              {success && <div className="alert-success mb-6">{success}</div>}
              {error && <div className="alert-error mb-6">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="section-spacing">
                  <h3 className="text-heading-3 mb-6">Data Partisipan</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        name="nama_lengkap"
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usia
                      </label>
                      <input
                        type="number"
                        name="usia"
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Studi semasa kuliah
                    </label>
                    <input
                      type="text"
                      name="program_studi"
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profesi saat ini
                    </label>
                    <input
                      type="text"
                      name="profesi_saat_ini"
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="section-spacing">
                  <h3 className="text-heading-3 mb-6">Feedback Anda</h3>

                  <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-900 mb-4">
                      1. Dari daftar rekomendasi, apakah ada yang sesuai dengan
                      profesi Anda saat ini?
                    </label>
                    <div className="space-y-3">
                      {recommendations.map((rec) => (
                        <label
                          key={rec.profession}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            name={rec.profession}
                            onChange={handleCheckboxChange}
                            className="form-checkbox"
                          />
                          <span className="text-gray-700">
                            {rec.profession}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-900 mb-2">
                      2. Bagaimana pendapat Anda mengenai penjelasan
                      rekomendasi?
                    </label>
                    <textarea
                      name="penjelasan_rekomendasi"
                      onChange={handleChange}
                      rows={4}
                      className="form-textarea"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-900 mb-4">
                      3. Dari skala 1-10, seberapa puas Anda dengan fitur ini?
                    </label>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {[...Array(10).keys()].map((i) => (
                        <label
                          key={i + 1}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="skala_kepuasan"
                            value={i + 1}
                            onChange={handleChange}
                            required
                            className="form-radio"
                          />
                          <span className="text-sm text-gray-700">{i + 1}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-900 mb-2">
                      4. Apakah ada saran atau masukan untuk perbaikan?
                    </label>
                    <textarea
                      name="saran_masukan"
                      onChange={handleChange}
                      rows={4}
                      className="form-textarea"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading || !!success}
                    className="btn-primary"
                  >
                    {loading ? "Mengirim..." : "Kirim Feedback"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;
