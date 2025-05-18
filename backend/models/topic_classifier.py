"""
Topic classification module.
"""

import openai
from backend.utils.config import OPENAI_API_KEY

CANDIDATES = ["business", "technology", "health", "education", "entertainment"]


def classify_topics(text):
    """Classify topics from the input text."""
    openai.api_key = OPENAI_API_KEY
    resp = openai.Classification.create(
        model="text-ada-001",
        query=text,
        labels=CANDIDATES,
    )
    return [label for label, score in resp.label_scores.items() if score > 0.1]
