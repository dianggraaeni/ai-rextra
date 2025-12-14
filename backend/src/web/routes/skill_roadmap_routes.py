"""
Skill Development Roadmap Routes
Rute API untuk menghasilkan roadmap pengembangan skill berdasarkan RIASEC dan target pekerjaan.
"""

from flask import Blueprint, request, jsonify
import json
from src.services.llm import generate_skill_development_roadmap

# Create Blueprint
skill_roadmap_bp = Blueprint('skill_roadmap', __name__)


@skill_roadmap_bp.route('/', methods=['POST'])
def generate_roadmap():
    """
    Menghasilkan roadmap pengembangan skill berdasarkan RIASEC dan target pekerjaan
    ---
    tags:
      - Skill Development Roadmap
    summary: Generate skill development roadmap
    description: |
      Endpoint ini menghasilkan roadmap pengembangan skill yang actionable berdasarkan 
      kode RIASEC mahasiswa dan target pekerjaan yang diinginkan. Roadmap mencakup 
      soft skills dan hard skills dengan langkah-langkah konkret yang dapat dilakukan.
      
      Roadmap disusun dalam bentuk checklist untuk memudahkan mahasiswa melacak progress.
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
                example: "RIA"
              target_jobs:
                type: array
                items:
                  type: string
                minItems: 1
                maxItems: 10
                description: Daftar pekerjaan target (maksimal 10)
                example: ["AI Engineer", "Data Analyst", "Machine Learning Engineer"]
    responses:
      200:
        description: Roadmap pengembangan skill berhasil dihasilkan
        content:
          application/json:
            schema:
              type: object
              properties:
                riasec_code:
                  type: string
                  description: Kode RIASEC yang dianalisis
                  example: "RIA"
                target_jobs:
                  type: array
                  items:
                    type: string
                  description: Daftar target pekerjaan
                  example: ["AI Engineer", "Data Analyst"]
                soft_skills:
                  type: array
                  description: Daftar soft skills yang perlu dikembangkan
                  items:
                    type: object
                    properties:
                      skill:
                        type: string
                        description: Nama soft skill
                        example: "Problem Solving"
                      description:
                        type: string
                        description: Penjelasan mengapa skill ini penting
                        example: "Kemampuan untuk mengidentifikasi dan memecahkan masalah kompleks"
                      action_steps:
                        type: array
                        items:
                          type: string
                        description: Langkah-langkah konkret untuk mengembangkan skill
                        example: ["Ikuti course problem solving", "Practice dengan case studies", "Join hackathon atau kompetisi"]
                      priority:
                        type: string
                        enum: ["High", "Medium", "Low"]
                        description: Prioritas pengembangan skill
                        example: "High"
                hard_skills:
                  type: array
                  description: Daftar hard skills/technical skills yang perlu dikembangkan
                  items:
                    type: object
                    properties:
                      skill:
                        type: string
                        description: Nama hard skill
                        example: "Python Programming"
                      description:
                        type: string
                        description: Penjelasan mengapa skill ini penting
                        example: "Bahasa pemrograman utama untuk AI dan data science"
                      action_steps:
                        type: array
                        items:
                          type: string
                        description: Langkah-langkah konkret untuk belajar skill ini
                        example: ["Complete Python basics course", "Build 3 personal projects", "Contribute to open source"]
                      priority:
                        type: string
                        enum: ["High", "Medium", "Low"]
                        description: Prioritas pengembangan skill
                        example: "High"
                roadmap_notes:
                  type: string
                  description: Catatan dan tips untuk mengikuti roadmap
                  example: "Fokus pada high priority skills terlebih dahulu, lakukan secara bertahap"
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
                    empty_jobs:
                      value: "Target jobs list cannot be empty after filtering"
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
        
        # Generate roadmap using LLM service
        roadmap_result = generate_skill_development_roadmap(riasec_code, filtered_jobs)
        
        # Parse the result to check for errors
        try:
            parsed_result = json.loads(roadmap_result)
            if "error" in parsed_result:
                return jsonify(parsed_result), 500
            
            # Return successful response
            return jsonify(parsed_result), 200
            
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid response format from roadmap service"}), 500
        
    except Exception as e:
        print(f"Error in generate_roadmap endpoint: {str(e)}")
        return jsonify({"error": "Internal server error occurred"}), 500
