"""
Dominant Type Routes
Rute API untuk menghasilkan penjelasan tipe dominan RIASEC.
"""

from flask import Blueprint, request, jsonify
import json
from src.services.llm import generate_dominant_type_explanation

# Create Blueprint
dominant_type_bp = Blueprint('dominant_type', __name__)


@dominant_type_bp.route('/', methods=['POST'])
def explain_dominant_type():
    """
    Menghasilkan penjelasan tipe dominan RIASEC untuk mahasiswa
    ---
    tags:
      - Dominant Type
    summary: Menghasilkan penjelasan tipe dominan RIASEC
    description: |
      Endpoint ini menghasilkan penjelasan yang mudah dipahami tentang tipe dominan RIASEC 
      dalam konteks mahasiswa. Penjelasan mencakup karakteristik, kekuatan, dan saran 
      pengembangan karier yang relevan dengan kehidupan kampus.
      
      Dapat menerima kode RIASEC tunggal (contoh: "R", "I") atau kombinasi (contoh: "RIA", "SEC").
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - dominant_type
            properties:
              dominant_type:
                type: string
                pattern: '^[RIASEC]{1,6}$'
                description: |
                  Kode RIASEC dominan yang akan dijelaskan. Dapat berupa:
                  - Huruf tunggal: R, I, A, S, E, C
                  - Kombinasi 2-6 huruf: RIA, SEC, EA, IAS, dll
                examples:
                  single:
                    value: "E"
                    summary: "Tipe tunggal Enterprising"
                  double:
                    value: "RI"
                    summary: "Kombinasi Realistic-Investigative"  
                  triple:
                    value: "RIA"
                    summary: "Kombinasi Realistic-Investigative-Artistic"
    responses:
      200:
        description: Penjelasan tipe dominan berhasil dihasilkan
        content:
          application/json:
            schema:
              type: object
              properties:
                explanation:
                  type: string
                  description: Deskripsi tipe dominan dalam 2-3 paragraf ringkas (bahasa sederhana, relevan untuk mahasiswa)
                  example: "Sebagai mahasiswa dengan profil RIA, kamu memiliki kombinasi yang unik antara sisi praktis, analitis, dan kreatif..."
                dominant_type:
                  type: string
                  description: Kode RIASEC yang dijelaskan
                  example: "RIA"
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
                      value: "Field 'dominant_type' is required"
                    invalid_format:
                      value: "Invalid dominant type. Must contain only letters R, I, A, S, E, C"
                    empty_value:
                      value: "Dominant type cannot be empty"
                    too_long:
                      value: "Dominant type cannot be longer than 6 characters"
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
        
        if 'dominant_type' not in data:
            return jsonify({"error": "Field 'dominant_type' is required"}), 400
        
        dominant_type = data['dominant_type']
        
        # Validate dominant_type value
        if not isinstance(dominant_type, str):
            return jsonify({"error": "Field 'dominant_type' must be a string"}), 400
        
        # Strip whitespace and validate against valid letters
        dominant_type = dominant_type.strip().upper()
        valid_letters = set("RIASEC")
        
        if not dominant_type:
            return jsonify({"error": "Dominant type cannot be empty"}), 400
        
        if not all(letter in valid_letters for letter in dominant_type):
            return jsonify({"error": "Invalid dominant_type. Must contain only letters R, I, A, S, E, C"}), 400
        
        if len(dominant_type) > 6:
            return jsonify({"error": "Dominant type cannot be longer than 6 characters"}), 400        # Generate explanation using LLM service
        explanation = generate_dominant_type_explanation(dominant_type)
        
        # Check if the explanation is an error response
        try:
            error_check = json.loads(explanation)
            if "error" in error_check:
                return jsonify(error_check), 500
        except json.JSONDecodeError:
            pass  # explanation is normal text, continue
        
        # Return successful response
        return jsonify({
            "explanation": explanation,
            "dominant_type": dominant_type
        }), 200
        
    except Exception as e:
        print(f"Error in explain_dominant_type endpoint: {str(e)}")
        return jsonify({"error": "Internal server error occurred"}), 500
