from flask import Blueprint, request, jsonify, session
from src.models.profession import ProfessionSelector
from src.services.llm import generate_assessment_statements, generate_final_analysis, generate_riasec_explanation
from src.database import validate_hash, save_assessment_results, get_assessment_by_hash, connect_to_mongo, save_assessment_additional_data
import json
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# RIASEC mapping for chart data
RIASEC_MAP_FULL = {
    'R': 'Realistic', 'I': 'Investigative', 'A': 'Artistic',
    'S': 'Social', 'E': 'Enterprising', 'C': 'Conventional'
}

# Create Assessment blueprint
assessment_blueprint = Blueprint('assessment', __name__)

@assessment_blueprint.route("/start", methods=["GET"])
def start_assessment():
    """
    Memulai penilaian profesi berdasarkan Ikigai
    ---
    tags:
      - Assessment
    summary: Memulai penilaian profesi berdasarkan Ikigai
    description: |
      Endpoint ini memulai tahap assessment dengan:
      1. Mengambil profil RIASEC dari session
      2. Memilih 5 profesi teratas yang sesuai
      3. Menggenerate pertanyaan Ikigai menggunakan AI
      
      Memerlukan session yang valid dengan hasil tes RIASEC.
    responses:
      200:
        description: Assessment berhasil dimulai
        content:
          application/json:
            schema:
              type: object
              properties:
                ikigai_questions:
                  type: array
                  description: Daftar pertanyaan assessment berbasis Ikigai
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
                        example: "Seberapa tertarik Anda dengan teknologi dan inovasi digital?"
                      category:
                        type: string
                        enum: ["What you love", "What you're good at", "What the world needs", "What you can be paid for"]
                        description: Kategori Ikigai
                        example: "What you love"
                      profession_context:
                        type: string
                        description: Konteks profesi yang terkait
                        example: "Software Engineer"
      400:
        description: Profil RIASEC tidak ditemukan
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Profil RIASEC tidak ditemukan. Harap selesaikan tes terlebih dahulu."
      500:
        description: Error dalam memulai assessment
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Error dalam memulai asesmen: [detail error]"
    """
    if "profile" not in session:
        return jsonify({"error": "Profil RIASEC tidak ditemukan. Harap selesaikan tes terlebih dahulu."}), 400

    try:
        selector = ProfessionSelector()
        top_professions = selector.select(session["profile"], top_n=5)

        professions_for_prompt = {
            name: {
                "role": data.get("role"),
                "role_description": data.get("role_description"),
                "core_skills": data.get("core_skills")
            }
            for name, data in top_professions.items()
        }
        
        statements = generate_assessment_statements(professions_for_prompt)

        # --- PERBAIKAN: Validasi yang lebih ketat terhadap respons LLM ---
        # Kita cek apakah responsnya valid DAN memiliki kunci yang kita butuhkan.
        if not statements or statements.get("error") or "ikigai_questions" not in statements:
            error_message = statements.get("error", "Format respons dari LLM tidak valid atau tidak berisi 'ikigai_questions'.")
            logger.error(f"LLM generation failed or returned invalid structure: {statements}")
            return jsonify({"error": error_message}), 500
        # --- END PERBAIKAN ---
        
        session['statements'] = statements
        session['profession_names_for_analysis'] = list(top_professions.keys())

        # --- DEBUG PRINT: Menampilkan JSON yang akan dikirim ke frontend ---
        print("\n" + "="*50)
        print("===== FINAL JSON TO BE SENT TO FRONTEND =====")
        print(json.dumps(statements, indent=2))
        print("="*50 + "\n")
        # --- END DEBUG ---

        return jsonify(statements)
    except Exception as e:
        logger.error(f"Error starting assessment: {e}", exc_info=True)
        return jsonify({"error": f"Error dalam memulai asesmen: {e}"}), 500


@assessment_blueprint.route("/submit", methods=["POST"])
def submit_assessment():
    """
    Mengirimkan jawaban assessment Ikigai
    ---
    tags:
      - Assessment
    summary: Mengirimkan jawaban assessment Ikigai
    description: |
      Endpoint ini memproses jawaban assessment dan menghasilkan:
      - Analisis final dengan rekomendasi profesi
      - Penjelasan profil RIASEC
      - Data chart untuk visualisasi
      
      Menggunakan AI untuk menganalisis kesesuaian profesi berdasarkan jawaban Ikigai.
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
                type: object
                description: Jawaban assessment dalam format key-value
                additionalProperties:
                  type: integer
                  minimum: 1
                  maximum: 5
                  description: |
                    Skala jawaban:
                    1 = Sangat Rendah/Tidak Tertarik
                    2 = Rendah/Kurang Tertarik
                    3 = Sedang/Netral
                    4 = Tinggi/Tertarik
                    5 = Sangat Tinggi/Sangat Tertarik
                example:
                  "1": 4
                  "2": 5
                  "3": 3
                  "4": 4
    responses:
      200:
        description: Assessment berhasil diproses
        content:
          application/json:
            schema:
              type: object
              properties:
                results:
                  type: object
                  description: Hasil analisis final
                  properties:
                    top_2:
                      type: array
                      description: 2 profesi teratas yang direkomendasikan
                      items:
                        type: string
                      example: ["Software Engineer", "Data Scientist"]
                    explanation:
                      type: string
                      description: Penjelasan detail rekomendasi
                      example: "Berdasarkan analisis profil RIASEC dan jawaban Ikigai Anda..."
                    compatibility_scores:
                      type: object
                      description: Skor kompatibilitas untuk setiap profesi
                      additionalProperties:
                        type: number
                        format: float
                      example:
                        "Software Engineer": 92.5
                        "Data Scientist": 88.3
                profile:
                  type: string
                  description: Profil RIASEC pengguna
                  example: "RSI"
                riasec_explanations:
                  type: object
                  description: Penjelasan untuk setiap kategori RIASEC
                  additionalProperties:
                    type: string
                riasec_map_full:
                  type: object
                  description: Mapping kode RIASEC ke nama lengkap
                  additionalProperties:
                    type: string
                chart_data:
                  type: object
                  description: Data untuk visualisasi chart
                  properties:
                    labels:
                      type: array
                      items:
                        type: string
                      example: ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"]
                    data:
                      type: array
                      items:
                        type: number
                        format: float
                      example: [85.5, 72.3, 45.2, 68.7, 55.1, 62.4]
      400:
        description: Sesi tidak valid atau data tidak ditemukan
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Sesi tidak valid."
      500:
        description: Error dalam memproses assessment
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Tidak dapat menemukan data detail untuk profesi yang dipilih."
    """
    if "profile" not in session or "assessment_hash" not in session:
        return jsonify({"error": "Sesi tidak valid atau hash tidak ditemukan."}), 400
    
    user_hash = session["assessment_hash"]

    data = request.json
    session['assessment_answers'] = data.get('answers')
    
    selector = ProfessionSelector()
    
    profession_names = session.get('profession_names_for_analysis', [])
    if not profession_names:
        return jsonify({"error": "Data profesi tidak ditemukan di sesi."}), 400
        
    # --- PERBAIKAN UTAMA: Gunakan kolom 'reasoning_hc' untuk mencari data ---
    professions_data = {}
    for name in profession_names:
        # Cari berdasarkan kolom 'reasoning_hc', bukan 'role'
        result_df = selector.df[selector.df['reasoning_hc'] == name]
        
        if not result_df.empty:
            professions_data[name] = result_df.to_dict('records')[0]
        else:
            logger.warning(f"Profession with reasoning_hc name '{name}' not found in the dataframe.")
    
    if not professions_data:
        return jsonify({"error": "Tidak dapat menemukan data detail untuk profesi yang dipilih."}), 500
    # --- END PERBAIKAN ---

    final_analysis = generate_final_analysis(professions_data, session["assessment_answers"])
    if final_analysis.get("error"):
        return jsonify({"error": final_analysis["error"]}), 500
    
    # top_profession_name sekarang sudah cocok dengan kolom 'reasoning_hc'
    top_profession_name = final_analysis.get("top_2", [list(professions_data.keys())[0]])[0]
    
    try:
        top_profession_df = selector.df[selector.df['reasoning_hc'] == top_profession_name]
        # Pastikan kolom 'riasec_explanation' ada sebelum diakses
        if 'riasec_explanation' in top_profession_df.columns:
            vector_explanation_text = top_profession_df['riasec_explanation'].iloc[0]
        else:
            # Fallback jika kolom tidak ada
            vector_explanation_text = top_profession_df['vector_explanation'].iloc[0]

    except (IndexError, KeyError):
        vector_explanation_text = "Penjelasan tidak tersedia."
        
    riasec_explanations = generate_riasec_explanation(session["profile"], vector_explanation_text)
    
    chart_data = {
        'labels': [RIASEC_MAP_FULL[key] for key in sorted(RIASEC_MAP_FULL.keys())],
        'data': [session["normalized_scores"].get(RIASEC_MAP_FULL[key], 0) for key in sorted(RIASEC_MAP_FULL.keys())]
    }

    session["final_analysis_for_feedback"] = final_analysis

    response_data = {
        "results": final_analysis,
        "profile": session["profile"],
        "riasec_explanations": riasec_explanations,
        "riasec_map_full": RIASEC_MAP_FULL,
        "chart_data": chart_data,
        "hash": user_hash
    }
    
    try:
        save_assessment_results(user_hash, response_data)
    except Exception as e:
        logger.error(f"Failed to save assessment results for hash {user_hash}: {e}")
        return jsonify({"error": "Gagal menyimpan hasil asesmen."}), 500
    
    return jsonify(response_data)

@assessment_blueprint.route("/validate_hash", methods=["POST"])
def validate_user_hash():
    """
    Memvalidasi hash yang dimasukkan pengguna sebelum memulai tes.
    """
    data = request.json
    user_hash = data.get("hash")

    if not user_hash:
        return jsonify({"error": "Hash tidak boleh kosong."}), 400

    if validate_hash(user_hash):
        session["assessment_hash"] = user_hash # Simpan hash di session
        return jsonify({"message": "Hash valid."}), 200
    else:
        return jsonify({"error": "Hash tidak valid atau sudah digunakan."}), 404
      
@assessment_blueprint.route("/result/<user_hash>", methods=["GET"])
def get_result_by_hash(user_hash):
    """
    Mengambil data hasil asesmen berdasarkan hash.
    """
    try:
        db = connect_to_mongo()
        assessment = db.assessments.find_one({"hash": user_hash})
        if assessment and assessment.get("results"):
            # Return results and additional_data if exists
            response_data = assessment["results"]
            if "additional_data" in assessment:
                response_data["additional_data"] = assessment["additional_data"]
            return jsonify(response_data)
        elif assessment:
            return jsonify({"error": "Assessment belum selesai. Silakan selesaikan tes terlebih dahulu."}), 404
        else:
            return jsonify({"error": "Hash tidak valid."}), 404
    except Exception as e:
        logger.error(f"Error retrieving assessment for hash {user_hash}: {e}")
        return jsonify({"error": "Terjadi kesalahan server."}), 500

@assessment_blueprint.route("/result/<user_hash>/additional", methods=["POST"])
def save_additional_result_data(user_hash):
    """
    Menyimpan data tambahan hasil asesmen berdasarkan hash.
    """
    try:
        data = request.json
        save_assessment_additional_data(user_hash, data)
        return jsonify({"message": "Data tambahan berhasil disimpan."}), 200
    except Exception as e:
        logger.error(f"Error saving additional data for hash {user_hash}: {e}")
        return jsonify({"error": "Gagal menyimpan data tambahan."}), 500