"""
Strengths & Weaknesses Analyzer Agent
Modul ini bertanggung jawab untuk menganalisis kekuatan dan area pengembangan
berdasarkan tipe RIASEC pengguna dalam konteks mahasiswa.
"""

import json
from .llm_client import llm_client


def generate_strengths_weaknesses_analysis(riasec_code: str) -> str:
    """
    Menghasilkan analisis kekuatan dan area pengembangan berdasarkan kode RIASEC.
    
    Args:
        riasec_code (str): Kode RIASEC (e.g., "R", "RIA", "SEC", "E", etc.)
    
    Returns:
        str: JSON string berisi daftar kekuatan dan area pengembangan
    """
    
    # Validasi input - pastikan hanya berisi huruf RIASEC yang valid
    valid_letters = set("RIASEC")
    riasec_code = riasec_code.upper().strip()
    
    if not riasec_code:
        return json.dumps({"error": "RIASEC code cannot be empty"})
    
    if not all(letter in valid_letters for letter in riasec_code):
        return json.dumps({"error": "Invalid RIASEC code. Must contain only letters R, I, A, S, E, C"})
    
    if len(riasec_code) > 6:
        return json.dumps({"error": "RIASEC code cannot be longer than 6 characters"})
    
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
    
    prompt = f"""
    Anda adalah seorang konselor karier yang ahli dalam analisis RIASEC. Berikan analisis kekuatan dan area pengembangan untuk mahasiswa.
    
    Kode RIASEC: {riasec_code}
    Profil: {type_summary}
    
    Tugas Anda:
    1. Identifikasi 4-6 kekuatan utama (strengths) berdasarkan profil RIASEC ini
    2. Identifikasi 3-4 area pengembangan (weaknesses/areas for development) 
    3. Fokus pada konteks mahasiswa dan pengembangan karier
    4. Berikan penjelasan singkat untuk setiap poin
    
    Format output JSON:
    {{
        "riasec_code": "{riasec_code}",
        "strengths": [
            {{
                "strength": "Nama kekuatan",
                "description": "Penjelasan singkat 1-2 kalimat tentang kekuatan ini"
            }}
        ],
        "weaknesses": [
            {{
                "weakness": "Area yang perlu dikembangkan",
                "description": "Penjelasan singkat 1-2 kalimat dan saran pengembangan"
            }}
        ]
    }}
    
    Contoh untuk referensi:
    - Tipe Enterprising: strengths = leadership, persuasion, networking; weaknesses = kurang detail-oriented, impatience
    - Tipe Realistic: strengths = practical problem-solving, hands-on skills; weaknesses = kurang komunikasi interpersonal
    
    Pastikan output HANYA berupa JSON yang valid, tanpa teks tambahan.
    """
    
    # --- DEBUG PRINT: Menampilkan prompt yang dikirim ke LLM ---
    print("\n" + "="*50)
    print("===== PROMPT SENT TO LLM (Strengths & Weaknesses Analyzer) =====")
    print(f"RIASEC Code: {riasec_code}")
    print(prompt)
    print("="*50 + "\n")
    # --- END DEBUG ---
    
    response = llm_client.invoke(prompt, service_name="Strengths & Weaknesses Analyzer")
    
    # Parse JSON response
    parsed_response = llm_client.parse_json_response(response)
    
    # Jika ada error dalam parsing, kembalikan error
    if "error" in parsed_response:
        return json.dumps(parsed_response)
    
    # Return the parsed JSON as string
    return json.dumps(parsed_response, ensure_ascii=False, indent=2)
