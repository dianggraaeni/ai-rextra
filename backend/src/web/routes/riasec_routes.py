from flask import Blueprint, request, jsonify
from src.models.riasec import RiasecTest
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create RIASEC blueprint
riasec_blueprint = Blueprint('riasec', __name__)

@riasec_blueprint.route("/questions", methods=["GET"])
def get_riasec_questions():
    """
    Mengambil daftar pertanyaan tes RIASEC
    ---
    tags:
      - RIASEC
    summary: Mengambil daftar pertanyaan tes RIASEC
    description: |
      Endpoint ini mengembalikan semua pertanyaan yang digunakan dalam tes kepribadian RIASEC.
      Setiap pertanyaan memiliki ID unik dan kategori RIASEC yang sesuai.
    responses:
      200:
        description: Daftar pertanyaan RIASEC berhasil diambil
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                    description: ID unik pertanyaan
                    example: 1
                  question:
                    type: string
                    description: Teks pertanyaan
                    example: "Saya senang bekerja dengan tangan dan alat-alat"
                  category:
                    type: string
                    enum: [R, I, A, S, E, C]
                    description: Kategori RIASEC
                    example: "R"
      500:
        description: Error server internal
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Tidak dapat memuat pertanyaan."
    """
    questions = RiasecTest.load_questions()
    if not questions:
        return jsonify({"error": "Tidak dapat memuat pertanyaan."}), 500
    return jsonify(questions)

@riasec_blueprint.route("/submit", methods=["POST"])
def submit_riasec_answers():
    """
    Mengirimkan jawaban tes RIASEC
    ---
    tags:
      - RIASEC
    summary: Mengirimkan jawaban tes RIASEC
    description: |
      Endpoint ini menerima jawaban pengguna untuk tes RIASEC dan mengembalikan:
      - Profil kepribadian RIASEC (kode 3 huruf)
      - Skor yang dinormalisasi untuk setiap kategori
      
      Jawaban disimpan dalam session untuk digunakan pada tahap assessment.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - answers
            properties:
              answers:
                type: array
                description: Array jawaban pengguna (1-5 skala Likert)
                items:
                  type: integer
                  minimum: 1
                  maximum: 5
                  description: |
                    Skala jawaban:
                    1 = Sangat Tidak Setuju
                    2 = Tidak Setuju  
                    3 = Netral
                    4 = Setuju
                    5 = Sangat Setuju
                example: [4, 3, 5, 2, 4, 3, 5, 1, 2, 4]
    responses:
      200:
        description: Jawaban berhasil diproses
        content:
          application/json:
            schema:
              type: object
              properties:
                profile:
                  type: string
                  description: Kode profil RIASEC 3 huruf
                  pattern: '^[RIASEC]{3}$'
                  example: "RSI"
                normalized_scores:
                  type: object
                  description: Skor yang dinormalisasi untuk setiap kategori RIASEC
                  properties:
                    Realistic:
                      type: number
                      format: float
                      example: 85.5
                    Investigative:
                      type: number
                      format: float
                      example: 72.3
                    Artistic:
                      type: number
                      format: float
                      example: 45.2
                    Social:
                      type: number
                      format: float
                      example: 68.7
                    Enterprising:
                      type: number
                      format: float
                      example: 55.1
                    Conventional:
                      type: number
                      format: float
                      example: 62.4
      400:
        description: Data jawaban tidak valid
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Data jawaban tidak valid."
    """
    from flask import session
    
    data = request.json
    answers = data.get("answers")
    all_questions = RiasecTest.load_questions()

    if not all_questions or not answers or len(answers) != len(all_questions):
        return jsonify({"error": "Data jawaban tidak valid."}), 400

    raw_scores = RiasecTest.calculate_raw_scores(all_questions, answers)
    normalized_scores = RiasecTest.normalize_scores(raw_scores)
    profile = RiasecTest.determine_profile(normalized_scores)

    # Store results in session for subsequent calls
    session['profile'] = profile
    session['normalized_scores'] = normalized_scores

    return jsonify({
        "profile": profile,
        "normalized_scores": normalized_scores
    })
