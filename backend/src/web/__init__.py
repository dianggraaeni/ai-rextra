# src/web/__init__.py

from flask import Flask

def register_blueprints(app):
    """Register all application blueprints"""
    from .routes.riasec_routes import riasec_blueprint
    from .routes.assessment_routes import assessment_blueprint
    from .routes.feedback_routes import feedback_blueprint
    from .routes.info_routes import info_blueprint
    from .routes.dominant_type_routes import dominant_type_bp
    from .routes.strengths_weaknesses_routes import strengths_weaknesses_bp
    from .routes.skill_roadmap_routes import skill_roadmap_bp
    from .routes.campus_activities_routes import campus_activities_bp
    
    # Register blueprints with URL prefixes
    app.register_blueprint(info_blueprint, url_prefix='/')
    app.register_blueprint(riasec_blueprint, url_prefix='/api/riasec')
    app.register_blueprint(assessment_blueprint, url_prefix='/api/assessment')
    app.register_blueprint(feedback_blueprint, url_prefix='/api/feedback')
    app.register_blueprint(dominant_type_bp, url_prefix='/api/dominant-type')
    app.register_blueprint(strengths_weaknesses_bp, url_prefix='/api/strengths-weaknesses')
    app.register_blueprint(skill_roadmap_bp, url_prefix='/api/skill-roadmap')
    app.register_blueprint(campus_activities_bp, url_prefix='/api/campus-activities')
