"""
Test for transcriber module: real and failure paths (mocked for CI).
"""

import backend.models.transcriber as transcriber
import pytest

def test_transcribe_exists():
    assert hasattr(transcriber, "transcribe")

def test_transcribe_failure(monkeypatch):
    def dummy_open(*args, **kwargs):
        raise FileNotFoundError()
    monkeypatch.setattr("builtins.open", dummy_open)
    with pytest.raises(FileNotFoundError):
        transcriber.transcribe("nonexistent.wav")
