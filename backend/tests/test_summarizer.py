"""
Test for summarizer module: function existence.
"""

import backend.models.summarizer as summarizer


def test_summarize_exists():
    assert hasattr(summarizer, "summarize")
