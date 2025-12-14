"""
LLM Client Module
Modul terpusat untuk menangani komunikasi dengan OpenRouter API.
Menghindari duplikasi kode dan memudahkan maintenance.
"""

import requests
import re
import json
from src.config import OPENROUTER_API_KEY, OPENROUTER_API_URL


class LLMClient:
    """Client untuk berkomunikasi dengan OpenRouter API."""
    
    def __init__(self):
        self.api_key = OPENROUTER_API_KEY
        self.api_url = OPENROUTER_API_URL
        self.default_model = "google/gemini-2.0-flash-001"
        self.timeout = 30
    
    def invoke(self, prompt: str, model: str = None, service_name: str = "LLM") -> str:
        """
        Mengirim prompt ke OpenRouter API dan mengembalikan respons teks.
        
        Args:
            prompt (str): Prompt yang akan dikirim ke LLM
            model (str): Model LLM yang akan digunakan (opsional)
            service_name (str): Nama service untuk debugging (opsional)
            
        Returns:
            str: Respons dari LLM atau JSON error jika gagal
        """
        if not self.api_key or self.api_key == 'your-openrouter-api-key-here':
            return json.dumps({"error": "API Key for OpenRouter is not configured."})
        
        model_to_use = model or self.default_model
        
        try:
            # --- DEBUG PRINT: Menampilkan detail request ---
            print("\n" + "="*50)
            print(f"===== REQUEST DETAILS ({service_name}) =====")
            print(f"URL: {self.api_url}")
            print(f"Model: {model_to_use}")
            print(f"API Key (first 10 chars): {self.api_key[:10]}...")
            print("="*50 + "\n")
            # --- END DEBUG ---
            
            response = requests.post(
                url=self.api_url,
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": model_to_use,
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=self.timeout
            )
            
            # --- DEBUG PRINT: Menampilkan detail response ---
            print("\n" + "="*50)
            print(f"===== RESPONSE DETAILS ({service_name}) =====")
            print(f"Status Code: {response.status_code}")
            if response.status_code != 200:
                print(f"Error Response Body: {response.text}")
                print("="*50 + "\n")
                response.raise_for_status()
            # --- END DEBUG ---
            
            response.raise_for_status()
            
            # --- DEBUG PRINT: Menampilkan respons mentah dari LLM ---
            raw_response_content = response.json()['choices'][0]['message']['content']
            print(f"===== RAW RESPONSE FROM LLM ({service_name}) =====")
            print(raw_response_content)
            print("="*50 + "\n")
            # --- END DEBUG ---
            
            return raw_response_content
            
        except requests.exceptions.RequestException as e:
            print(f"Error calling LLM API: {e}")
            return json.dumps({"error": "Failed to communicate with the LLM service."})
    
    def parse_json_response(self, response: str, default_on_error=None):
        """
        Mengekstrak dan mem-parsing JSON dari respons LLM yang mungkin berisi teks tambahan.
        
        Args:
            response (str): Respons mentah dari LLM
            default_on_error: Nilai default jika parsing gagal
            
        Returns:
            dict: JSON yang telah diparsing atau default value jika gagal
        """
        try:
            match = re.search(r'\{.*\}', response, re.DOTALL)
            if match:
                json_str = match.group(0)
                # Bersihkan trailing comma
                json_str = re.sub(r',\s*}', '}', json_str)
                json_str = re.sub(r',\s*]', ']', json_str)
                return json.loads(json_str)
            print(f"DEBUG: No JSON object found in LLM response: {response}")
        except json.JSONDecodeError as e:
            print(f"DEBUG: JSON decode error: {e}. Response: {response}")
        
        return default_on_error if default_on_error is not None else {"error": "Invalid JSON response from LLM."}


# Singleton instance untuk digunakan di seluruh aplikasi
llm_client = LLMClient()
