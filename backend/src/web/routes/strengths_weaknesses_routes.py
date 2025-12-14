"""
Strengths & Weaknesses Routes
Rute API untuk menganalisis kekuatan dan area pengembangan berdasarkan RIASEC.
"""

from flask import Blueprint, request, jsonify
import json
from src.services.llm import generate_strengths_weaknesses_analysis

# Create Blueprint
strengths_weaknesses_bp = Blueprint('strengths_weaknesses', __name__)


@strengths_weaknesses_bp.route('/', methods=['POST'])
def analyze_strengths_weaknesses():
    """
    Menganalisis kekuatan dan area pengembangan berdasarkan kode RIASEC
    ---
    tags:
      - Strengths & Weaknesses
    summary: Analisis kekuatan dan area pengembangan RIASEC
    description: |
      Endpoint ini menganalisis kekuatan utama dan area pengembangan berdasarkan 
      kode RIASEC pengguna. Memberikan daftar kekuatan yang dapat dioptimalkan 
      dan area yang perlu dikembangkan dalam konteks mahasiswa dan karier.
      
      Dapat menerima kode RIASEC tunggal (contoh: "E", "R") atau kombinasi (contoh: "RIA", "SEC").
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - riasec_code
            properties:
              riasec_code:
                type: string
                pattern: '^[RIASEC]{1,6}$'
                description: |
                  Kode RIASEC untuk dianalisis. Dapat berupa:
                  - Huruf tunggal: R, I, A, S, E, C
                  - Kombinasi 2-6 huruf: RIA, SEC, EA, IAS, dll
                examples:
                  single:
                    value: "E"
                    summary: "Tipe Enterprising"
                  combination:
                    value: "RIA"
                    summary: "Kombinasi Realistic-Investigative-Artistic"
    responses:
      200:
        description: Analisis kekuatan dan area pengembangan berhasil dihasilkan
        content:
          application/json:
            schema:
              type: object
              properties:
                riasec_code:
                  type: string
                  description: Kode RIASEC yang dianalisis
                  example: "E"
                strengths:
                  type: array
                  description: Daftar kekuatan utama
                  items:
                    type: object
                    properties:
                      strength:
                        type: string
                        description: Nama kekuatan
                        example: "Leadership"
                      description:
                        type: string
                        description: Penjelasan singkat tentang kekuatan ini
                        example: "Kemampuan natural untuk memimpin dan mengarahkan orang lain menuju tujuan bersama"
                weaknesses:
                  type: array
                  description: Daftar area yang perlu dikembangkan
                  items:
                    type: object
                    properties:
                      weakness:
                        type: string
                        description: Area yang perlu dikembangkan
                        example: "Detail-oriented"
                      description:
                        type: string
                        description: Penjelasan singkat dan saran pengembangan
                        example: "Cenderung fokus pada gambaran besar dan perlu melatih perhatian pada detail-detail kecil"
      400:
        description: Request tidak valid
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  examples:
                    missing_field:
                      value: "Field 'riasec_code' is required"
                    invalid_format:
                      value: "Invalid RIASEC code. Must contain only letters R, I, A, S, E, C"
                    empty_value:
                      value: "RIASEC code cannot be empty"
                    too_long:
                      value: "RIASEC code cannot be longer than 6 characters"
                    invalid_content_type:
                      value: "Content-Type must be application/json"
      500:
        description: Error server internal
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  examples:
                    llm_error:
                      value: "API Key for OpenRouter is not configured."
                    server_error:
                      value: "Internal server error occurred"
    """
    try:
        # Validate request content type
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        # Get request data
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        if 'riasec_code' not in data:
            return jsonify({"error": "Field 'riasec_code' is required"}), 400
        
        riasec_code = data['riasec_code']
        
        # Validate riasec_code value
        if not isinstance(riasec_code, str):
            return jsonify({"error": "Field 'riasec_code' must be a string"}), 400
        
        # Strip whitespace and validate against valid letters
        riasec_code = riasec_code.strip().upper()
        valid_letters = set("RIASEC")
        
        if not riasec_code:
            return jsonify({"error": "RIASEC code cannot be empty"}), 400
        
        if not all(letter in valid_letters for letter in riasec_code):
            return jsonify({"error": "Invalid RIASEC code. Must contain only letters R, I, A, S, E, C"}), 400
        
        if len(riasec_code) > 6:
            return jsonify({"error": "RIASEC code cannot be longer than 6 characters"}), 400
        
        # Generate analysis using LLM service
        analysis_result = generate_strengths_weaknesses_analysis(riasec_code)
        
        # Parse the result to check for errors
        try:
            parsed_result = json.loads(analysis_result)
            if "error" in parsed_result:
                return jsonify(parsed_result), 500
            
            # Return successful response
            return jsonify(parsed_result), 200
            
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid response format from analysis service"}), 500
        
    except Exception as e:
        print(f"Error in analyze_strengths_weaknesses endpoint: {str(e)}")
        return jsonify({"error": "Internal server error occurred"}), 500
