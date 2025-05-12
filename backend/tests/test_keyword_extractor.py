"""
Tests for keyword_extractor module: success and failure paths.
"""

import backend.models.keyword_extractor as keyword_extractor
import pytest

def test_extract_keywords_success():
    text = "Python is a programming language. AI and ML are popular topics."
    keywords = keyword_extractor.extract_keywords(text)
    assert isinstance(keywords, list)
    assert len(keywords) > 0
    assert any("Python" in k or "programming" in k for k in keywords)

def test_extract_keywords_empty():
    keywords = keyword_extractor.extract_keywords("")
    assert isinstance(keywords, list)
    assert len(keywords) == 0
