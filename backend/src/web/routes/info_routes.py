from flask import Blueprint, jsonify

# Create Info blueprint for API information
info_blueprint = Blueprint('info', __name__)

@info_blueprint.route("/", methods=["GET"])
def api_info():
    """
    Informasi API
    ---
    tags:
      - Info
    summary: Informasi umum tentang API
    description: |
      Endpoint ini memberikan informasi umum tentang API AI-REXTRA
      dan link ke dokumentasi interaktif.
    responses:
      200:
        description: Informasi API berhasil diambil
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  example: "AI-REXTRA API"
                version:
                  type: string
                  example: "1.0.0"
                description:
                  type: string
                  example: "API untuk sistem rekomendasi profesi berbasis RIASEC dan Ikigai"
                documentation_url:
                  type: string
                  example: "/apidocs/"
                endpoints:
                  type: object
                  properties:
                    riasec:
                      type: array
                      items:
                        type: string
                      example: ["/riasec/questions", "/riasec/submit"]
                    assessment:
                      type: array
                      items:
                        type: string
                      example: ["/assessment/start", "/assessment/submit"]
                    feedback:
                      type: array
                      items:
                        type: string
                      example: ["/feedback"]
    """
    return jsonify({
        "name": "AI-REXTRA API",
        "version": "1.0.0",
        "description": "API untuk sistem rekomendasi profesi berbasis RIASEC dan Ikigai",
        "documentation_url": "/apidocs/",
        "endpoints": {
            "riasec": [
                "/riasec/questions",
                "/riasec/submit"
            ],
            "assessment": [
                "/assessment/start",
                "/assessment/submit"
            ],
            "feedback": [
                "/feedback"
            ]
        },
        "features": [
            "Tes kepribadian RIASEC (Holland Code)",
            "Assessment berbasis konsep Ikigai",
            "Rekomendasi profesi menggunakan AI",
            "Sistem feedback pengguna",
            "Dokumentasi API interaktif dengan Swagger"
        ],
        "contact": {
            "email": "support@ai-rextra.com",
            "documentation": "/apidocs/"
        }
    })

@info_blueprint.route("/health", methods=["GET"])
def health_check():
    """
    Health Check
    ---
    tags:
      - Info
    summary: Memeriksa status kesehatan API
    description: Endpoint untuk memeriksa apakah API berjalan dengan baik
    responses:
      200:
        description: API berjalan dengan baik
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  example: "healthy"
                message:
                  type: string
                  example: "API is running properly"
                timestamp:
                  type: string
                  format: date-time
                  example: "2024-01-01T12:00:00Z"
    """
    from datetime import datetime
    return jsonify({
        "status": "healthy",
        "message": "API is running properly",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })
