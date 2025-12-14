"""
Dominant Type Explainer Agent
Modul ini bertanggung jawab untuk menghasilkan penjelasan yang mudah dipahami 
tentang tipe dominan RIASEC pengguna dalam konteks mahasiswa.
"""

import json
from .llm_client import llm_client


def generate_dominant_type_explanation(dominant_type: str) -> str:
    """
    Menghasilkan penjelasan tentang tipe dominan RIASEC dalam konteks mahasiswa.
    
    Args:
        dominant_type (str): Kode RIASEC dominan (e.g., "R", "RIA", "SEC", "E", etc.)
    
    Returns:
        str: Penjelasan dalam bahasa Indonesia yang mudah dipahami untuk mahasiswa
    """
    
    # Validasi input - pastikan hanya berisi huruf RIASEC yang valid
    valid_letters = set("RIASEC")
    dominant_type = dominant_type.upper().strip()
    
    if not dominant_type:
        return json.dumps({"error": "Dominant type cannot be empty"})
    
    if not all(letter in valid_letters for letter in dominant_type):
        return json.dumps({"error": "Invalid dominant type. Must contain only letters R, I, A, S, E, C"})
    
    if len(dominant_type) > 6:
        return json.dumps({"error": "Dominant type cannot be longer than 6 characters"})
    
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
    type_descriptions = [riasec_mapping[letter] for letter in dominant_type]
    
    if len(dominant_type) == 1:
        type_summary = f"tipe {type_descriptions[0]}"
        complexity_note = "Dengan satu tipe yang sangat dominan, Anda memiliki karakteristik yang cukup fokus dan terarah."
    elif len(dominant_type) == 2:
        type_summary = f"kombinasi tipe {type_descriptions[0]} dan {type_descriptions[1]}"
        complexity_note = "Kombinasi dua tipe ini memberikan Anda keseimbangan yang menarik dalam kepribadian."
    elif len(dominant_type) == 3:
        type_summary = f"kombinasi tiga tipe: {', '.join(type_descriptions[:-1])} dan {type_descriptions[-1]}"
        complexity_note = "Tiga tipe yang dominan ini menunjukkan kepribadian yang kompleks dan multitalenta."
    else:
        type_summary = f"kombinasi beragam: {', '.join(type_descriptions[:-1])} dan {type_descriptions[-1]}"
        complexity_note = "Keragaman tipe ini menunjukkan fleksibilitas dan adaptabilitas yang tinggi dalam berbagai situasi."
    
    prompt = f"""
    Anda adalah seorang konselor karier yang ramah. Buatlah deskripsi tipe dominan RIASEC dalam 2-3 paragraf singkat untuk mahasiswa.
    
    Kode RIASEC: {dominant_type}
    Profil: {type_summary}
    
    Tulis deskripsi yang:
    - Menggunakan bahasa Indonesia yang sederhana dan mudah dipahami
    - Relevan dengan kehidupan mahasiswa (kuliah, organisasi, karier)
    - Bersifat positif dan mendukung
    - Fokus pada kekuatan dan potensi mereka
    - Total 2-3 paragraf ringkas (sekitar 150-200 kata)
    
    Format:
    Paragraf 1: Jelaskan karakteristik utama tipe {dominant_type} dengan bahasa sederhana
    Paragraf 2: Bagaimana tipe ini berguna dalam konteks mahasiswa (studi, organisasi, masa depan)
    
    Mulai dengan kalimat pembuka seperti: "Sebagai mahasiswa dengan profil {dominant_type}, kamu memiliki..."
    
    Tulis langsung tanpa format markdown atau tambahan lainnya.
    """
    
    # --- DEBUG PRINT: Menampilkan prompt yang dikirim ke LLM ---
    print("\n" + "="*50)
    print("===== PROMPT SENT TO LLM (Dominant Type Explainer) =====")
    print(f"Dominant Type: {dominant_type}")
    print(prompt)
    print("="*50 + "\n")
    # --- END DEBUG ---
    
    response = llm_client.invoke(prompt, service_name="Dominant Type Explainer")
    
    # Jika response berisi error JSON, return as is
    try:
        error_check = json.loads(response)
        if "error" in error_check:
            return response
    except json.JSONDecodeError:
        pass  # Response is normal text, continue
    
    # Return the explanation as plain text
    return response.strip()
