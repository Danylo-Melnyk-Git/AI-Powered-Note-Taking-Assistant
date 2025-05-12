"""
Test for transcriber module: function existence.
"""

import backend.models.transcriber as transcriber


def test_transcribe_exists():
    assert hasattr(transcriber, "transcribe")
