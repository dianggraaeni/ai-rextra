"""
Skill Development Roadmap Agent
Modul ini bertanggung jawab untuk menghasilkan roadmap pengembangan skill
berdasarkan tipe RIASEC dan target pekerjaan yang diinginkan mahasiswa.
"""

import json
from .llm_client import llm_client


def generate_skill_development_roadmap(riasec_code: str, target_jobs: list) -> str:
    """
    Menghasilkan roadmap pengembangan skill berdasarkan kode RIASEC dan target pekerjaan.
    
    Args:
        riasec_code (str): Kode RIASEC (e.g., "R", "RIA", "SEC", "E", etc.)
        target_jobs (list): Daftar pekerjaan target (e.g., ["AI Engineer", "Data Analyst"])
    
    Returns:
        str: JSON string berisi roadmap pengembangan soft skill dan hard skill
    """
    
    # Validasi input RIASEC - pastikan hanya berisi huruf RIASEC yang valid
    valid_letters = set("RIASEC")
    riasec_code = riasec_code.upper().strip()
    
    if not riasec_code:
        return json.dumps({"error": "RIASEC code cannot be empty"})
    
    if not all(letter in valid_letters for letter in riasec_code):
        return json.dumps({"error": "Invalid RIASEC code. Must contain only letters R, I, A, S, E, C"})
    
    if len(riasec_code) > 6:
        return json.dumps({"error": "RIASEC code cannot be longer than 6 characters"})
    
    # Validasi target jobs
    if not target_jobs or not isinstance(target_jobs, list):
        return json.dumps({"error": "Target jobs must be a non-empty list"})
    
    if len(target_jobs) > 10:
        return json.dumps({"error": "Too many target jobs. Maximum 10 jobs allowed"})
    
    # Filter job yang tidak kosong
    target_jobs = [job.strip() for job in target_jobs if job and job.strip()]
    if not target_jobs:
        return json.dumps({"error": "Target jobs list cannot be empty after filtering"})
    
    # Mapping huruf ke nama lengkap
    riasec_mapping = {
        "R": "Realistic (Realistis)",
        "I": "Investigative (Investigatif)", 
        "A": "Artistic (Artistik)",
        "S": "Social (Sosial)",
        "E": "Enterprising (Enterprising)",
        "C": "Conventional (Konvensional)"
    }
    
    # Buat deskripsi tipe berdasarkan huruf-huruf dalam kode
    type_descriptions = [riasec_mapping[letter] for letter in riasec_code]
    
    if len(riasec_code) == 1:
        type_summary = f"tipe {type_descriptions[0]}"
    elif len(riasec_code) == 2:
        type_summary = f"kombinasi tipe {type_descriptions[0]} dan {type_descriptions[1]}"
    elif len(riasec_code) == 3:
        type_summary = f"kombinasi tiga tipe: {', '.join(type_descriptions[:-1])} dan {type_descriptions[-1]}"
    else:
        type_summary = f"kombinasi beragam: {', '.join(type_descriptions[:-1])} dan {type_descriptions[-1]}"
    
    jobs_list = ", ".join(target_jobs)
    
    prompt = f"""
    Anda adalah seorang career coach yang ahli dalam pengembangan skill untuk mahasiswa. Buatlah roadmap pengembangan skill yang actionable.
    
    Profil Mahasiswa:
    - Kode RIASEC: {riasec_code}
    - Profil: {type_summary}
    - Target Pekerjaan: {jobs_list}
    
    Tugas Anda:
    1. Analisis skill yang dibutuhkan untuk mencapai target pekerjaan tersebut
    2. Pertimbangkan kesesuaian dengan profil RIASEC mahasiswa
    3. Buat roadmap yang terdiri dari soft skills dan hard skills
    4. Setiap skill harus actionable (bisa dicapai mahasiswa) dengan langkah konkret
    5. Prioritaskan skill berdasarkan urgensi dan relevansi
    
    Format output JSON:
    {{
        "riasec_code": "{riasec_code}",
        "target_jobs": {json.dumps(target_jobs)},
        "soft_skills": [
            {{
                "skill": "Nama soft skill",
                "description": "Penjelasan mengapa skill ini penting",
                "action_steps": [
                    "Langkah konkret 1",
                    "Langkah konkret 2",
                    "Langkah konkret 3"
                ],
                "priority": "High|Medium|Low"
            }}
        ],
        "hard_skills": [
            {{
                "skill": "Nama hard skill/teknis",
                "description": "Penjelasan mengapa skill ini penting",
                "action_steps": [
                    "Langkah konkret 1 (misal: course, tutorial, project)",
                    "Langkah konkret 2",
                    "Langkah konkret 3"
                ],
                "priority": "High|Medium|Low"
            }}
        ],
        "roadmap_notes": "Catatan singkat tentang how to approach roadmap ini sebagai mahasiswa"
    }}
    
    Contoh untuk referensi:
    - Realistic → problem-solving, hands-on technical skills, mechanical aptitude
    - Social → communication, empathy, conflict resolution, teamwork
    - Investigative → analytical thinking, research skills, data analysis
    - Artistic → creativity, design thinking, storytelling
    - Enterprising → leadership, negotiation, business acumen
    - Conventional → organization, attention to detail, project management
    
    Berikan 3-5 soft skills dan 4-6 hard skills yang paling relevan.
    Pastikan action_steps bersifat konkret dan dapat dilakukan mahasiswa (tidak abstrak).
    
    Pastikan output HANYA berupa JSON yang valid, tanpa teks tambahan.
    """
    
    # --- DEBUG PRINT: Menampilkan prompt yang dikirim ke LLM ---
    print("\n" + "="*50)
    print("===== PROMPT SENT TO LLM (Skill Development Roadmap) =====")
    print(f"RIASEC Code: {riasec_code}")
    print(f"Target Jobs: {target_jobs}")
    print(prompt)
    print("="*50 + "\n")
    # --- END DEBUG ---
    
    response = llm_client.invoke(prompt, service_name="Skill Development Roadmap")
    
    # Parse JSON response
    parsed_response = llm_client.parse_json_response(response)
    
    # Jika ada error dalam parsing, kembalikan error
    if "error" in parsed_response:
        return json.dumps(parsed_response)
    
    # Return the parsed JSON as string
    return json.dumps(parsed_response, ensure_ascii=False, indent=2)
