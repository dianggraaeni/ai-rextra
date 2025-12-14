// frontend/src/pages/ResultPage.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CombinedResults from "../components/CombinedResults";
import Navbar from "../components/Navbar";

const ResultPage = () => {
  const { hash } = useParams(); // Mengambil hash dari URL
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hash) {
      axios.get(`/api/assessment/result/${hash}`)
        .then(response => {
          setResultData(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.response?.data?.error || "Gagal memuat hasil.");
          setLoading(false);
        });
    }
  }, [hash]);

  // Load additional data if not present
  useEffect(() => {
    if (!resultData || !resultData.additional_data) {
      const loadAdditionalData = async () => {
        try {
          const additionalData = {};

          // Skill Roadmap
          const roadmapResponse = await axios.post("/api/skill-roadmap/", {
            riasec_code: resultData.profile,
            target_jobs: resultData.results?.top_2 || []
          });
          additionalData.skill_roadmap = roadmapResponse.data;

          // Dominant Type
          const dominantResponse = await axios.post("/api/dominant-type/", {
            dominant_type: resultData.profile
          });
          additionalData.dominant_type = dominantResponse.data;

          // Campus Activities
          const activitiesResponse = await axios.post("/api/campus-activities/", {
            riasec_code: resultData.profile,
            target_jobs: resultData.results?.top_2 || []
          });
          additionalData.campus_activities = activitiesResponse.data;

          // Strengths & Weaknesses
          const swResponse = await axios.post("/api/strengths-weaknesses/", {
            riasec_code: resultData.profile
          });
          additionalData.strengths_weaknesses = swResponse.data;

          // Save to backend
          await axios.post(`/api/assessment/result/${hash}/additional`, additionalData);

          // Update local state
          setResultData(prev => ({ ...prev, additional_data: additionalData }));

        } catch (error) {
          console.error("Error loading additional data:", error);
        }
      };

      if (resultData && !resultData.additional_data) {
        loadAdditionalData();
      }
    }
  }, [resultData, hash]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="mt-4 text-xl font-semibold text-gray-700">
          Memuat Hasil...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="mt-4 text-xl font-semibold text-red-600">{error}</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {resultData && <CombinedResults initialData={resultData} />}
    </>
  );
};

export default ResultPage;