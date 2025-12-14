from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from .config import SECRET_KEY
from .database import connect_to_mongo
from .seed_db import seed_database
import yaml
import os

def create_app():
    """Application Factory Function"""
    app = Flask(__name__)
    app.secret_key = SECRET_KEY
    CORS(app)  # Enable CORS for all routes

    # Configure Swagger/OpenAPI Documentation
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/",
        "openapi": "3.0.3"
    }

    # Load OpenAPI specification from YAML file
    api_docs_path = os.path.join(os.path.dirname(__file__), 'api_docs.yaml')
    if os.path.exists(api_docs_path):
        with open(api_docs_path, 'r', encoding='utf-8') as f:
            swagger_template = yaml.safe_load(f)
        swagger_config['template'] = swagger_template

    # Initialize Swagger
    swagger = Swagger(app, config=swagger_config)

    with app.app_context():
        try:
            db = connect_to_mongo()
            seed_database(db)
        except Exception as e:
            app.logger.error(f"Failed to initialize database connection or seeding: {e}")

        from .web import register_blueprints
        register_blueprints(app)

    return app