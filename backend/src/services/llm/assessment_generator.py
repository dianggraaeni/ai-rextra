"""
Assessment Generator Agent
Modul ini bertanggung jawab untuk menghasilkan pernyataan asesmen IKIGAI 
berdasarkan data profesi yang diberikan.
"""

import json
from .llm_client import llm_client


def generate_assessment_statements(professions_data: dict):
    """Membuat pertanyaan asesmen IKIGAI berdasarkan data profesi."""
    
    prompt = f"""
    Anda adalah seorang Career Counselor berpengalaman yang merancang tes IKIGAI.
    Berdasarkan 5 kandidat profesi berikut yang relevan dengan hasil tes RIASEC pengguna:
    {json.dumps(professions_data, indent=2)}

    Tugas Anda adalah membuat 4 pertanyaan untuk Tes IKIGAI yang akan membantu pengguna merefleksikan karier mereka.
    Setiap pertanyaan harus memiliki 5 opsi jawaban yang terinspirasi dari 5 profesi di atas.

    **Struktur Output JSON yang Diharapkan:**
    - Buat sebuah JSON object dengan satu kunci utama: "ikigai_questions".
    - "ikigai_questions" harus berisi sebuah array dari 4 objek pertanyaan.
    - Setiap objek pertanyaan harus memiliki tiga kunci:
      1. `dimension`: Nama dimensi IKIGAI ("Love", "Good At", "Needs", "Profession").
      2. `instruction`: Teks instruksi untuk pengguna sesuai dengan panduan.
      3. `options`: Sebuah array berisi 5 string yang menjadi pilihan jawaban. Setiap pilihan harus secara implisit merepresentasikan salah satu dari 5 profesi yang diberikan.

    **Panduan untuk Setiap Dimensi:**

    1.  **Dimensi "Love" (Apa yang Disukai):**
        -   `instruction`: "Di antara aktivitas berikut, pilih satu atau dua yang paling Anda sukai, paling menarik bagi Anda, dan dapat Anda lakukan secara rutin dalam jangka panjang."
        -   `options`: Buat 5 opsi yang mendeskripsikan aktivitas inti atau tugas yang paling menyenangkan dari masing-masing 5 profesi.

    2.  **Dimensi "Good At" (Apa yang Dikuasai):**
        -   `instruction`: "Di antara kemampuan berikut, pilih satu atau dua yang paling Anda kuasai atau merasa paling mampu melakukannya."
        -   `options`: Buat 5 opsi yang mendeskripsikan keahlian atau kompetensi utama dari masing-masing 5 profesi.

    3.  **Dimensi "Needs" (Apa yang Dibutuhkan Dunia):**
        -   `instruction`: "Di antara kontribusi berikut, pilih satu atau dua yang paling ingin Anda berikan kepada masyarakat melalui karier Anda."
        -   `options`: Buat 5 opsi yang mendeskripsikan dampak atau kontribusi sosial dari masing-masing 5 profesi.

    4.  **Dimensi "Profession" (Aspek Ekonomi):**
        -   `instruction`: "Dengan mempertimbangkan aspek penghasilan dan keberlanjutan karier, pilih satu atau dua opsi yang paling sesuai dengan situasi dan harapan Anda saat ini."
        -   `options`: Buat 5 opsi yang mendeskripsikan aspek ekonomi, stabilitas, atau prospek karier dari masing-masing 5 profesi.

    **Aturan Penting:**
    1.  **JANGAN sebutkan nama profesi** di dalam teks `instruction` atau `options`.
    2.  Pastikan output adalah **HANYA JSON yang valid**, tanpa teks pembuka atau penutup seperti \`\`\`json.
    3.  Setiap array `options` harus berisi **tepat 5 string**.

    Contoh kerangka output (gunakan ini sebagai struktur akhir):
    {{
      "ikigai_questions": [
        {{
          "dimension": "Love",
          "instruction": "Di antara aktivitas berikut...",
          "options": ["Deskripsi aktivitas profesi 1", "Deskripsi aktivitas profesi 2", "...", "...", "..."]
        }},
        {{
          "dimension": "Good At",
          "instruction": "Di antara kemampuan berikut...",
          "options": ["Deskripsi keahlian profesi 1", "Deskripsi keahlian profesi 2", "...", "...", "..."]
        }},
        {{
          "dimension": "Needs",
          "instruction": "Di antara kontribusi berikut...",
          "options": ["Deskripsi kontribusi profesi 1", "Deskripsi kontribusi profesi 2", "...", "...", "..."]
        }},
        {{
          "dimension": "Profession",
          "instruction": "Dengan mempertimbangkan aspek penghasilan...",
          "options": ["Deskripsi aspek ekonomi profesi 1", "Deskripsi aspek ekonomi profesi 2", "...", "...", "..."]
        }}
      ]
    }}
    """
    
    # --- DEBUG PRINT: Menampilkan prompt yang dikirim ke LLM ---
    print("\n" + "="*50)
    print("===== PROMPT SENT TO LLM (Assessment Generator) =====")
    print(prompt)
    print("="*50 + "\n")
    # --- END DEBUG ---
    
    response = llm_client.invoke(prompt, service_name="Assessment Generator")
    return llm_client.parse_json_response(response)
