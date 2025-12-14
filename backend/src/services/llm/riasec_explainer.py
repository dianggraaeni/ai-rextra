"""
RIASEC Explainer Agent
Modul ini bertanggung jawab untuk menghasilkan penjelasan yang mudah dipahami 
tentang profil RIASEC pengguna.
"""

import json
from .llm_client import llm_client


def generate_riasec_explanation(user_profile: str, vector_explanation: str):
    """Menghasilkan penjelasan sederhana untuk setiap kode RIASEC pengguna."""
    prompt = f"""
    Anda adalah seorang psikolog karier yang hebat dalam menyederhanakan konsep kompleks. Berdasarkan penjelasan teknis di bawah ini, buatlah penjelasan yang hangat dan memotivasi untuk setiap tipe kepribadian RIASEC yang dimiliki oleh pengguna.

    Penjelasan Teknis Vektor RIASEC (dari profesi yang cocok):
    "{vector_explanation}"

    Kode RIASEC Pengguna: "{user_profile}"

    Tugas Anda:
    1. Untuk SETIAP huruf dalam Kode RIASEC Pengguna, tulis satu paragraf penjelasan (sekitar 2-3 kalimat) yang positif dan mudah dimengerti.
    2. Penjelasan Anda HARUS berdasarkan informasi yang ada di dalam "Penjelasan Teknis Vektor RIASEC". Contoh: Jika penjelasan teknis menyebutkan "hands-on use of analytical tools (Realistic: 0.5)", maka penjelasan untuk 'R' harus tentang bagaimana pengguna suka bekerja langsung dengan alat-alat praktis.
    3. Gunakan bahasa yang personal dan menyemangati.
    4. JANGAN menambahkan informasi apa pun yang tidak dapat disimpulkan dari teks yang diberikan.
    5. Kembalikan hasilnya dalam format JSON yang valid, di mana key adalah huruf kode (misal, "R") dan value adalah penjelasannya.

    Contoh format output untuk pengguna dengan kode "REC":
    {{
      "R": "Anda memiliki sisi Realistis yang kuat...",
      "E": "Sifat Enterprising Anda menunjukkan bahwa...",
      "C": "Anda juga seorang yang Konvensional, yang artinya..."
    }}
    """
    
    # --- DEBUG PRINT: Menampilkan prompt yang dikirim ke LLM ---
    print("\n" + "="*50)
    print("===== PROMPT SENT TO LLM (RIASEC Explainer) =====")
    print(prompt)
    print("="*50 + "\n")
    # --- END DEBUG ---
    
    response = llm_client.invoke(prompt, service_name="RIASEC Explainer")
    default_error = {code: "Penjelasan tidak dapat dibuat saat ini." for code in user_profile}
    return llm_client.parse_json_response(response, default_on_error=default_error)
