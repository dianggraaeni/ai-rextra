"""
LLM Services Package
Facade untuk mengakses semua agent LLM dalam aplikasi.

Modul ini mengekspos fungsi-fungsi utama dari setiap agent LLM
agar dapat diimpor dengan mudah dari bagian lain aplikasi.
"""

from .assessment_generator import generate_assessment_statements
from .final_analyzer import generate_final_analysis
from .riasec_explainer import generate_riasec_explanation
from .dominant_type_explainer import generate_dominant_type_explanation
from .strengths_weaknesses_analyzer import generate_strengths_weaknesses_analysis
from .skill_roadmap_generator import generate_skill_development_roadmap
from .campus_activities_recommender import generate_campus_activities_recommendations

# Expose all LLM functions for easy import
__all__ = [
    'generate_assessment_statements',
    'generate_final_analysis', 
    'generate_riasec_explanation',
    'generate_dominant_type_explanation',
    'generate_strengths_weaknesses_analysis',
    'generate_skill_development_roadmap',
    'generate_campus_activities_recommendations'
]
