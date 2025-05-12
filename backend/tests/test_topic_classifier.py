"""
Tests for topic_classifier module: success and failure paths.
"""

import backend.models.topic_classifier as topic_classifier
import pytest

def test_classify_topics_success(monkeypatch):
    class DummyResp:
        label_scores = {"business": 0.2, "technology": 0.05}
    def dummy_create(*args, **kwargs):
        return DummyResp()
    monkeypatch.setattr(topic_classifier.openai, "Classification", type("Classification", (), {"create": staticmethod(dummy_create)}))
    topics = topic_classifier.classify_topics("This is a business text.")
    assert isinstance(topics, list)
    assert "business" in topics
    assert "technology" not in topics

def test_classify_topics_empty(monkeypatch):
    class DummyResp:
        label_scores = {"business": 0.0, "technology": 0.0}
    def dummy_create(*args, **kwargs):
        return DummyResp()
    monkeypatch.setattr(topic_classifier.openai, "Classification", type("Classification", (), {"create": staticmethod(dummy_create)}))
    topics = topic_classifier.classify_topics("")
    assert isinstance(topics, list)
    assert len(topics) == 0
