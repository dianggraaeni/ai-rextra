from flask import Blueprint, request, jsonify, session
from src.database import save_feedback
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Feedback blueprint
feedback_blueprint = Blueprint('feedback', __name__)

@feedback_blueprint.route("", methods=["POST"])
def submit_feedback():
    """
    Mengirimkan feedback pengguna
    ---
    tags:
      - Feedback
    summary: Mengirimkan feedback pengguna
    description: |
      Endpoint ini menerima feedback dari pengguna tentang hasil rekomendasi profesi.
      Data feedback disimpan untuk evaluasi dan perbaikan sistem.
      Session akan dibersihkan setelah feedback berhasil dikirim.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - nama_lengkap
              - usia
              - rekomendasi_sesuai
              - skala_kepuasan
            properties:
              nama_lengkap:
                type: string
                description: Nama lengkap pengguna
                minLength: 2
                maxLength: 100
                example: "John Doe"
              usia:
                type: integer
                description: Usia pengguna
                minimum: 16
                maximum: 100
                example: 25
              program_studi:
                type: string
                description: Program studi saat ini atau terakhir
                maxLength: 100
                example: "Teknik Informatika"
              profesi_saat_ini:
                type: string
                description: Profesi atau pekerjaan saat ini
                maxLength: 100
                example: "Junior Developer"
              rekomendasi_sesuai:
                type: string
                enum: ["ya", "tidak", "sebagian"]
                description: Apakah rekomendasi sesuai dengan ekspektasi
                example: "ya"
              penjelasan_rekomendasi:
                type: string
                description: Penjelasan tentang kesesuaian rekomendasi
                maxLength: 500
                example: "Rekomendasi sangat sesuai dengan minat dan kemampuan saya"
              skala_kepuasan:
                type: integer
                description: Skala kepuasan terhadap sistem (1-10)
                minimum: 1
                maximum: 10
                example: 8
              saran_masukan:
                type: string
                description: Saran dan masukan untuk perbaikan sistem
                maxLength: 1000
                example: "Mungkin bisa ditambahkan lebih banyak pilihan profesi di bidang teknologi"
    responses:
      200:
        description: Feedback berhasil dikirim
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Terima kasih atas feedback Anda!"
      400:
        description: Tidak ada data hasil untuk feedback atau data tidak valid
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Tidak ada data hasil untuk diberikan feedback."
    """
    if "final_analysis_for_feedback" not in session:
        return jsonify({"error": "Tidak ada data hasil untuk diberikan feedback."}), 400
    
    data = request.json
    results = session.get("final_analysis_for_feedback")

    feedback_data = {
        "nama": data.get("nama_lengkap"),
        "usia": data.get("usia"),
        "program_studi": data.get("program_studi"),
        "profesi_saat_ini": data.get("profesi_saat_ini"),
        "rekomendasi_sesuai": data.get("rekomendasi_sesuai"),
        "penjelasan_rekomendasi": data.get("penjelasan_rekomendasi"),
        "skala_kepuasan": data.get("skala_kepuasan"),
        "saran_masukan": data.get("saran_masukan"),
        "hasil_rekomendasi": results,
        "submitted_at": datetime.utcnow()
    }
    
    save_feedback(feedback_data)
    session.clear()
    
    return jsonify({"message": "Terima kasih atas feedback Anda!"}), 200
