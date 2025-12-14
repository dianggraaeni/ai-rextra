"""
Campus Activities Recommendation Routes
Rute API untuk merekomendasikan aktivitas kampus berdasarkan RIASEC dan target pekerjaan.
"""

from flask import Blueprint, request, jsonify
import json
from src.services.llm import generate_campus_activities_recommendations

# Create Blueprint
campus_activities_bp = Blueprint('campus_activities', __name__)


@campus_activities_bp.route('/', methods=['POST'])
def recommend_campus_activities():
    """
    Merekomendasikan aktivitas kampus berdasarkan RIASEC dan target pekerjaan
    ---
    tags:
      - Campus Activities
    summary: Recommend campus and organizational activities
    description: |
      Endpoint ini merekomendasikan aktivitas kampus dan organisasi yang mendukung 
      pengembangan diri mahasiswa berdasarkan kode RIASEC dan target pekerjaan. 
      Rekomendasi mencakup organisasi, kompetisi, project, dan volunteer activities.
      
      Aktivitas yang direkomendasikan disesuaikan dengan kepribadian mahasiswa dan 
      relevan dengan karier yang diinginkan.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - riasec_code
              - target_jobs
            properties:
              riasec_code:
                type: string
                pattern: '^[RIASEC]{1,6}$'
                description: |
                  Kode RIASEC mahasiswa. Dapat berupa:
                  - Huruf tunggal: R, I, A, S, E, C
                  - Kombinasi 2-6 huruf: RIA, SEC, EA, IAS, dll
                example: "EA"
              target_jobs:
                type: array
                items:
                  type: string
                minItems: 1
                maxItems: 10
                description: Daftar pekerjaan target (maksimal 10)
                example: ["Event Manager", "Creative Director", "Marketing Manager"]
    responses:
      200:
        description: Rekomendasi aktivitas kampus berhasil dihasilkan
        content:
          application/json:
            schema:
              type: object
              properties:
                riasec_code:
                  type: string
                  description: Kode RIASEC yang dianalisis
                  example: "EA"
                target_jobs:
                  type: array
                  items:
                    type: string
                  description: Daftar target pekerjaan
                  example: ["Event Manager", "Creative Director"]
                organizational_activities:
                  type: array
                  description: Rekomendasi organisasi kampus
                  items:
                    type: object
                    properties:
                      activity:
                        type: string
                        description: Nama organisasi/kegiatan
                        example: "BEM (Badan Eksekutif Mahasiswa)"
                      description:
                        type: string
                        description: Penjelasan singkat tentang aktivitas
                        example: "Organisasi mahasiswa tingkat universitas yang mengelola kegiatan kemahasiswaan"
                      benefits:
                        type: string
                        description: Manfaat untuk pengembangan diri dan karier
                        example: "Mengembangkan leadership, management skills, dan networking"
                      commitment_level:
                        type: string
                        enum: ["High", "Medium", "Low"]
                        description: Tingkat komitment yang diperlukan
                        example: "High"
                      relevance_to_jobs:
                        type: string
                        description: Relevansi dengan target pekerjaan
                        example: "Sangat relevan untuk Event Manager - experience dalam organizing events besar"
                competitions_events:
                  type: array
                  description: Rekomendasi kompetisi dan event
                  items:
                    type: object
                    properties:
                      activity:
                        type: string
                        example: "Business Plan Competition"
                      description:
                        type: string
                        example: "Kompetisi membuat rencana bisnis tingkat nasional"
                      benefits:
                        type: string
                        example: "Mengasah strategic thinking dan presentation skills"
                      commitment_level:
                        type: string
                        enum: ["High", "Medium", "Low"]
                        example: "Medium"
                      relevance_to_jobs:
                        type: string
                        example: "Relevan untuk Marketing Manager - memahami business strategy"
                projects_initiatives:
                  type: array
                  description: Rekomendasi project dan inisiatif
                  items:
                    type: object
                    properties:
                      activity:
                        type: string
                        example: "Student Startup Incubator"
                      description:
                        type: string
                        example: "Program inkubasi startup untuk mahasiswa"
                      benefits:
                        type: string
                        example: "Hands-on experience dalam entrepreneurship dan innovation"
                      commitment_level:
                        type: string
                        enum: ["High", "Medium", "Low"]
                        example: "High"
                      relevance_to_jobs:
                        type: string
                        example: "Sangat relevan untuk Creative Director - experience dalam innovation"
                volunteer_social:
                  type: array
                  description: Rekomendasi kegiatan volunteer dan sosial
                  items:
                    type: object
                    properties:
                      activity:
                        type: string
                        example: "Community Art Workshop"
                      description:
                        type: string
                        example: "Mengajar seni dan kreativitas untuk anak-anak di komunitas"
                      benefits:
                        type: string
                        example: "Mengembangkan teaching skills dan social responsibility"
                      commitment_level:
                        type: string
                        enum: ["High", "Medium", "Low"]
                        example: "Medium"
                      relevance_to_jobs:
                        type: string
                        example: "Relevan untuk Creative Director - experience dalam creative education"
                recommendations_summary:
                  type: string
                  description: Summary strategi memilih aktivitas kampus
                  example: "Fokus pada aktivitas yang menggabungkan kreativitas dan leadership untuk memaksimalkan potensi EA personality"
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
                    missing_riasec:
                      value: "Field 'riasec_code' is required"
                    missing_jobs:
                      value: "Field 'target_jobs' is required"
                    invalid_riasec:
                      value: "Invalid RIASEC code. Must contain only letters R, I, A, S, E, C"
                    invalid_jobs:
                      value: "Target jobs must be a non-empty list"
                    too_many_jobs:
                      value: "Too many target jobs. Maximum 10 jobs allowed"
      500:
        description: Error server internal
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Internal server error occurred"
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
            
        if 'target_jobs' not in data:
            return jsonify({"error": "Field 'target_jobs' is required"}), 400
        
        riasec_code = data['riasec_code']
        target_jobs = data['target_jobs']
        
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
        
        # Validate target_jobs
        if not isinstance(target_jobs, list):
            return jsonify({"error": "Target jobs must be a list"}), 400
            
        if not target_jobs:
            return jsonify({"error": "Target jobs list cannot be empty"}), 400
            
        if len(target_jobs) > 10:
            return jsonify({"error": "Too many target jobs. Maximum 10 jobs allowed"}), 400
        
        # Filter and validate job names
        filtered_jobs = []
        for job in target_jobs:
            if not isinstance(job, str):
                return jsonify({"error": "All job names must be strings"}), 400
            job = job.strip()
            if job:  # Only add non-empty jobs
                filtered_jobs.append(job)
        
        if not filtered_jobs:
            return jsonify({"error": "Target jobs list cannot be empty after filtering"}), 400
        
        # Generate recommendations using LLM service
        recommendations_result = generate_campus_activities_recommendations(riasec_code, filtered_jobs)
        
        # Parse the result to check for errors
        try:
            parsed_result = json.loads(recommendations_result)
            if "error" in parsed_result:
                return jsonify(parsed_result), 500
            
            # Return successful response
            return jsonify(parsed_result), 200
            
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid response format from recommendations service"}), 500
        
    except Exception as e:
        print(f"Error in recommend_campus_activities endpoint: {str(e)}")
        return jsonify({"error": "Internal server error occurred"}), 500
