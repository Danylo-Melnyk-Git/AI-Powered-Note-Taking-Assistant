"""
Keyword extraction module.
"""

from rake_nltk import Rake


def extract_keywords(text):
    """Extract keywords from the input text."""
    rake = Rake()
    rake.extract_keywords_from_text(text)
    return rake.get_ranked_phrases()[:10]
