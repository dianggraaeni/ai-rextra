import pandas as pd
import re
from typing import Dict, Any
from src.database import connect_to_mongo

RIASEC_INDEX_MAP = {'R': 0, 'I': 1, 'A': 2, 'S': 3, 'E': 4, 'C': 5}

class ProfessionSelector:
    """
    Mengelola semua logika yang terkait dengan data profesi,
    termasuk memuat dari database dan memilih berdasarkan profil.
    """
    def __init__(self):
        try:
            db = connect_to_mongo()
            professions_collection = db.professions
            cursor = professions_collection.find({})
            data_list = list(cursor)

            if not data_list:
                print("WARNING: Professions collection is empty. Please ensure database seeding is completed.")
                raise ValueError("Database collection 'professions' is empty. Please run database seeding first.")

            self.df = pd.DataFrame(data_list)
            if '_id' in self.df.columns:
                self.df.drop('_id', axis=1, inplace=True)

            self.df = self.df.dropna(subset=["RIASEC Vector"])
            self.df["vector"] = self.df["RIASEC Vector"].apply(self.parse_vector)
            self.df["reasoning_hc"] = self.df["reasoning_hc"].astype(str)
        except Exception as e:
            print(f"Error initializing ProfessionSelector: {e}")
            raise

    @staticmethod
    def parse_vector(vec_str):
        vals = []
        for k in ['R', 'I', 'A', 'S', 'E', 'C']:
            v_str = re.search(f"{k}:([\d\.]+)", vec_str)
            vals.append(float(v_str.group(1)) if v_str else 0.0)
        return vals

    def select(self, user_profile: str, top_n: int = 3) -> Dict[str, Any]:
        top_codes = list(user_profile.upper())
        top_indices = [RIASEC_INDEX_MAP[c] for c in top_codes if c in RIASEC_INDEX_MAP]
        
        def sum_top_codes(vec):
            return sum(vec[i] for i in top_indices) if len(vec) == 6 else 0
            
        self.df["score_profile"] = self.df["vector"].apply(sum_top_codes)
        top_n = min(top_n, len(self.df))
        top_df = self.df.sort_values("score_profile", ascending=False).head(top_n)
        return {row["reasoning_hc"]: row.to_dict() for _, row in top_df.iterrows()}