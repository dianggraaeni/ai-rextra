"""
Final Analyzer Agent
Modul ini bertanggung jawab untuk menganalisis jawaban pengguna dan menghasilkan 
analisis akhir dengan skor kecocokan untuk setiap profesi.
"""

import json
from .llm_client import llm_client


def generate_final_analysis(professions: dict, answers: dict):
    """Membuat analisis akhir dan skor berdasarkan jawaban pengguna."""
    prompt = f"""
    Anda adalah seorang analis karier ahli. Tugas Anda adalah memberikan analisis akhir yang mendalam berdasarkan jawaban pengguna dalam sebuah kuesioner.

    Tiga Kandidat Profesi Awal:
    {json.dumps(professions, indent=2)}

    Jawaban Lengkap Pengguna:
    {json.dumps(answers, indent=2)}

    Instruksi Analisis:
    1. Untuk SETIAP dari 3 kandidat profesi, berikan skor kecocokan dalam persentase (0-100%).
    2. Untuk SETIAP profesi, berikan "alasan" yang terdiri dari 2-3 kalimat yang menghubungkan jawaban pengguna dengan deskripsi profesi tersebut.
    3. Tentukan 2 profesi teratas berdasarkan skor tertinggi.
    4. Sajikan hasilnya dalam format JSON yang valid.

    Contoh Format Output JSON:
    {{
        "analysis": [
            {{"profession": "Data Analyst", "match_percentage": 85, "reason": "Preferensi Anda untuk 'menganalisis data' sangat selaras dengan peran seorang Data Analyst."}},
            {{"profession": "AI Engineer", "match_percentage": 90, "reason": "Minat Anda pada tantangan teknis cocok dengan peran AI Engineer."}},
            {{"profession": "DevOps Engineer", "match_percentage": 60, "reason": "Fokus Anda lebih pada pengembangan daripada infrastruktur."}}
        ],
        "top_2": ["AI Engineer", "Data Analyst"]
    }}
    """
    
    # --- DEBUG PRINT: Menampilkan prompt yang dikirim ke LLM ---
    print("\n" + "="*50)
    print("===== PROMPT SENT TO LLM (Final Analyzer) =====")
    print(prompt)
    print("="*50 + "\n")
    # --- END DEBUG ---
    
    response = llm_client.invoke(prompt, service_name="Final Analyzer")
    return llm_client.parse_json_response(response)
