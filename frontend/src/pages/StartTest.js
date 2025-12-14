// frontend/src/pages/StartTest.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Komponen Spinner bisa di-copy dari RiasecTest.js jika perlu
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


const StartTest = () => {
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hash) {
      setError("Silakan masukkan kode unik Anda.");
      return;
    }
    setLoading(true);
    setError("");

    axios.post("/api/assessment/validate_hash", { hash })
      .then(() => {
        // Jika hash valid, backend akan menyimpannya di session.
        // Arahkan ke halaman terima kasih dulu
        navigate("/thank-you");
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Terjadi kesalahan. Coba lagi.");
        setLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center relative overflow-hidden">
        {/* Background Effects seperti di LandingPage */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">Mulai Asesmen</h1>
            <p className="mt-2 text-black-100">
              Masukkan kode unik yang Anda terima melalui WhatsApp di{" "}
              <a href="https://wa.me/6285117242155" className="font-medium text-black hover:text-black-200 underline">
                +62 851-1724-2155
              </a>
              .
            </p>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-200 bg-red-900/50 backdrop-blur-sm rounded-xl border border-red-700/50" role="alert">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="hash-input" className="block text-sm font-medium text-black">
                Kode Unik
              </label>
              <input
                id="hash-input"
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Contoh: 123e4567-e89b-12d3-a456-426614174000"
                className="w-full px-3 py-2 mt-1 bg-white/20 border border-white/30 rounded-md shadow-sm text-black placeholder-black/10 focus:outline-none focus:ring-cyan-400 focus:border-cyan-400 backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-6 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:opacity-50 transform hover:scale-105 transition-all duration-200"
              >
                {loading ? <Spinner /> : "Lanjutkan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StartTest;