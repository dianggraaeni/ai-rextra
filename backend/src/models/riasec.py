from src.database import connect_to_mongo

class RiasecTest:
    """
    Mengelola semua logika yang terkait dengan Tes RIASEC,
    termasuk memuat pertanyaan dan menghitung skor.
    """
    RIASEC_MAP = {
        'R': 'Realistic', 'I': 'Investigative', 'A': 'Artistic',
        'S': 'Social', 'E': 'Enterprising', 'C': 'Conventional'
    }
    SCALE_DEFINITIONS = {
        'Minat': {
            1: 'Tidak Tertarik', 2: 'Kurang Tertarik', 3: 'Netral',
            4: 'Tertarik', 5: 'Sangat Tertarik'
        },
        'Kepercayaan Diri': {
            1: 'Tidak Yakin', 2: 'Kurang Yakin', 3: 'Ragu-ragu',
            4: 'Yakin', 5: 'Sangat Yakin'
        },
        'Frekuensi': {
            1: 'Tidak Pernah', 2: 'Jarang', 3: 'Kadang-kadang',
            4: 'Sering', 5: 'Sangat Sering'
        }
    }

    @staticmethod
    def load_questions():
        """Mengambil pertanyaan dari koleksi MongoDB."""
        try:
            db = connect_to_mongo()
            questions_collection = db.riasec_questions
            questions_data = list(questions_collection.find({}, {'_id': 0}))

            if not questions_data:
                print("Warning: No questions found in the database.")
                return []

            for q in questions_data:
                q['type'] = RiasecTest.RIASEC_MAP.get(q['id'][0])
            return questions_data
        except Exception as e:
            print(f"An error occurred while loading questions from MongoDB: {e}")
            return []

    @staticmethod
    def calculate_raw_scores(questions, answers):
        scores = {name: 0 for name in RiasecTest.RIASEC_MAP.values()}
        for i, question in enumerate(questions):
            if i < len(answers) and answers[i]:
                try:
                    scores[question['type']] += int(answers[i])
                except (ValueError, TypeError, KeyError):
                    continue
        return scores

    @staticmethod
    def normalize_scores(raw_scores):
        normalized = {}
        MIN_SCORE, MAX_SCORE = 12, 60
        for category, score in raw_scores.items():
            norm_score = ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100
            normalized[category] = round(norm_score, 2)
        return normalized

    @staticmethod
    def determine_profile(normalized_scores):
        if not normalized_scores: return "N/A"
        sorted_scores = sorted(normalized_scores.items(), key=lambda x: x[1], reverse=True)
        skor_max, skor_2nd, skor_3rd = sorted_scores[0][1], sorted_scores[1][1], sorted_scores[2][1]
        selisih_1_2, selisih_2_3 = skor_max - skor_2nd, skor_2nd - skor_3rd
        if skor_max >= 80 and selisih_1_2 > 20: return sorted_scores[0][0][0]
        if skor_max >= 65 and selisih_1_2 <= 20 and selisih_2_3 <= 15 and skor_3rd >= 55:
            return "".join([s[0][0] for s in sorted_scores[:3]])
        if skor_max >= 60 and selisih_1_2 <= 15 and skor_2nd >= 50:
            return "".join([s[0][0] for s in sorted_scores[:2]])
        return sorted_scores[0][0][0]