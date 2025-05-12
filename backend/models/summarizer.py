"""
Text summarization module.
"""

import openai
from utils.config import OPENAI_API_KEY


def summarize(text):
    """Summarize the input text."""
    openai.api_key = OPENAI_API_KEY
    prompt = f"Summarize the following in under 500 characters:\n\n{text}"
    resp = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )
    return resp.choices[0].message.content.strip()
