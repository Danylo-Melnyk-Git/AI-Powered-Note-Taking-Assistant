"""
Test for summarizer module: real and failure paths (mocked for CI).
"""

import backend.models.summarizer as summarizer
import pytest

def test_summarize_exists():
    assert hasattr(summarizer, "summarize")

def test_summarize_failure(monkeypatch):
    def dummy_create(*args, **kwargs):
        raise Exception("API error")
    monkeypatch.setattr(summarizer.openai, "ChatCompletion", type("ChatCompletion", (), {"create": staticmethod(dummy_create)}))
    with pytest.raises(Exception):
        summarizer.summarize("test")
