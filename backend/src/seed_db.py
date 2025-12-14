# src/seed_db.py

import os
import pandas as pd
import json

def _init_professions(db):
    """Menginisialisasi koleksi profesi dari file Excel jika kosong."""
    professions_collection = db.professions
    if professions_collection.count_documents({}) == 0:
        print("Professions collection is empty. Seeding data from Excel...")
        try:
            # Path relatif dari lokasi file ini
            current_dir = os.path.dirname(os.path.abspath(__file__))
            data_path = os.path.join(current_dir, 'data', 'dataset-riasec-rextra.xlsx')
            df = pd.read_excel(data_path)
            
            # Ubah nama kolom agar konsisten
            if 'holland_code' in df.columns:
                df.rename(columns={'holland_code': 'reasoning_hc'}, inplace=True)
            if 'riasec_explanation' in df.columns:
                df.rename(columns={'riasec_explanation': 'vector_explanation'}, inplace=True)
            
            df.dropna(subset=["RIASEC Vector"], inplace=True)
            data_to_insert = df.to_dict(orient='records')
            professions_collection.insert_many(data_to_insert)
            print(f"Successfully inserted {len(data_to_insert)} documents into 'professions' collection.")
        except FileNotFoundError:
            print(f"ERROR: Data file not found at {data_path}")
        except Exception as e:
            print(f"An error occurred during profession data seeding: {e}")
    else:
        print("Professions collection already contains data. Skipping seed.")

def _init_riasec_questions(db):
    """Menginisialisasi koleksi pertanyaan RIASEC dari file JSON jika kosong."""
    questions_collection = db.riasec_questions
    if questions_collection.count_documents({}) == 0:
        print("RIASEC questions collection is empty. Seeding data from JSON...")
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            questions_file_path = os.path.join(current_dir, 'data/riasec_questions.json')
            with open(questions_file_path, 'r', encoding='utf-8') as f:
                questions_data = json.load(f)
            
            questions_collection.insert_many(questions_data)
            print(f"Successfully inserted {len(questions_data)} documents into 'riasec_questions' collection.")
        except FileNotFoundError:
            print(f"ERROR: riasec_questions.json not found at {questions_file_path}")
        except Exception as e:
            print(f"An error occurred during question data seeding: {e}")
    else:
        print("RIASEC questions collection already contains data. Skipping seed.")

def seed_database(db):
    """
    Fungsi utama untuk menjalankan semua proses seeding yang diperlukan.
    """
    print("--- Running Database Seeder ---")
    _init_professions(db)
    _init_riasec_questions(db)
    print("--- Seeding Complete ---")