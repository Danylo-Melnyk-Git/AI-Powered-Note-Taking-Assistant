"""
Speech-to-text transcription module.
"""

import openai
from backend.utils.config import OPENAI_API_KEY


def transcribe(file_path):
    """Transcribe audio file at file_path to text using OpenAI Whisper API."""
    openai.api_key = OPENAI_API_KEY
    with open(file_path, "rb") as audio_file:
        resp = openai.Audio.transcribe("whisper-1", audio_file)
    return resp["text"]
