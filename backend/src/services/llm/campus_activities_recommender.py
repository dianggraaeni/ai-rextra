"""
Campus Activities Recommender Agent
Modul ini bertanggung jawab untuk merekomendasikan aktivitas kampus dan organisasi
yang mendukung pengembangan diri berdasarkan tipe RIASEC dan target pekerjaan.
"""

import json
from .llm_client import llm_client


def generate_campus_activities_recommendations(riasec_code: str, target_jobs: list) -> str:
    """
    Menghasilkan rekomendasi aktivitas kampus berdasarkan kode RIASEC dan target pekerjaan.
    
    Args:
        riasec_code (str): Kode RIASEC (e.g., "R", "RIA", "SEC", "E", etc.)
        target_jobs (list): Daftar pekerjaan target (e.g., ["AI Engineer", "Data Analyst"])
    
    Returns:
        str: JSON string berisi rekomendasi aktivitas kampus dan organisasi
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
    Anda adalah seorang student advisor yang ahli dalam pengembangan mahasiswa melalui aktivitas kampus. Berikan rekomendasi aktivitas kampus dan organisasi.
    
    Profil Mahasiswa:
    - Kode RIASEC: {riasec_code}
    - Profil: {type_summary}
    - Target Pekerjaan: {jobs_list}
    
    Tugas Anda:
    1. Rekomendasikan aktivitas kampus yang sesuai dengan profil RIASEC mahasiswa
    2. Pertimbangkan relevansi dengan target pekerjaan yang diinginkan
    3. Berikan aktivitas yang realistis dan tersedia di kebanyakan kampus Indonesia
    4. Kategorikan berdasarkan jenis aktivitas (organisasi, kompetisi, project, dll)
    5. Berikan alasan mengapa aktivitas tersebut bermanfaat
    
    Format output JSON:
    {{
        "riasec_code": "{riasec_code}",
        "target_jobs": {json.dumps(target_jobs)},
        "organizational_activities": [
            {{
                "activity": "Nama organisasi/kegiatan",
                "description": "Penjelasan singkat tentang aktivitas",
                "benefits": "Manfaat untuk pengembangan diri dan karier",
                "commitment_level": "High|Medium|Low",
                "relevance_to_jobs": "Penjelasan relevansi dengan target pekerjaan"
            }}
        ],
        "competitions_events": [
            {{
                "activity": "Nama kompetisi/event",
                "description": "Penjelasan singkat tentang kompetisi/event",
                "benefits": "Manfaat untuk pengembangan diri dan karier",
                "commitment_level": "High|Medium|Low",
                "relevance_to_jobs": "Penjelasan relevansi dengan target pekerjaan"
            }}
        ],
        "projects_initiatives": [
            {{
                "activity": "Nama project/inisiatif",
                "description": "Penjelasan singkat tentang project",
                "benefits": "Manfaat untuk pengembangan diri dan karier", 
                "commitment_level": "High|Medium|Low",
                "relevance_to_jobs": "Penjelasan relevansi dengan target pekerjaan"
            }}
        ],
        "volunteer_social": [
            {{
                "activity": "Nama kegiatan volunteer/sosial",
                "description": "Penjelasan singkat tentang kegiatan",
                "benefits": "Manfaat untuk pengembangan diri dan karier",
                "commitment_level": "High|Medium|Low", 
                "relevance_to_jobs": "Penjelasan relevansi dengan target pekerjaan"
            }}
        ],
        "recommendations_summary": "Summary singkat tentang strategi memilih aktivitas kampus untuk profil ini"
    }}
    
    Contoh untuk referensi:
    - Realistic → UKM teknik, workshop hands-on, lab research, maker space
    - Investigative → research group, jurnal ilmiah, data science club, academic competition
    - Artistic → UKM seni, desain, fotografi, creative writing, media kampus
    - Social → volunteer, tutor sebaya, peer counselor, community service, student mentor
    - Enterprising → BEM, event organizer, business competition, startup incubator, leadership program
    - Conventional → administrative roles, finance committee, documentation team, academic administration
    
    Berikan 2-4 aktivitas untuk setiap kategori yang paling relevan.
    Pastikan aktivitas realistis dan bisa ditemukan di kampus Indonesia pada umumnya.
    
    Pastikan output HANYA berupa JSON yang valid, tanpa teks tambahan.
    """
    
    # --- DEBUG PRINT: Menampilkan prompt yang dikirim ke LLM ---
    print("\n" + "="*50)
    print("===== PROMPT SENT TO LLM (Campus Activities Recommender) =====")
    print(f"RIASEC Code: {riasec_code}")
    print(f"Target Jobs: {target_jobs}")
    print(prompt)
    print("="*50 + "\n")
    # --- END DEBUG ---
    
    response = llm_client.invoke(prompt, service_name="Campus Activities Recommender")
    
    # Parse JSON response
    parsed_response = llm_client.parse_json_response(response)
    
    # Jika ada error dalam parsing, kembalikan error
    if "error" in parsed_response:
        return json.dumps(parsed_response)
    
    # Return the parsed JSON as string
    return json.dumps(parsed_response, ensure_ascii=False, indent=2)
