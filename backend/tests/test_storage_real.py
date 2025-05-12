"""
Test for storage module: real and failure paths (mocked for CI).
"""

import backend.utils.storage as storage
import pytest

def test_upload_file_exists():
    assert hasattr(storage, "upload_file")

def test_upload_file_failure(monkeypatch):
    def dummy_upload_file(*args, **kwargs):
        raise Exception("S3 error")
    monkeypatch.setattr(storage.s3, "upload_file", dummy_upload_file)
    with pytest.raises(Exception):
        storage.upload_file("fake", "fake")

def test_download_file_exists():
    assert hasattr(storage, "download_file")

def test_download_file_failure(monkeypatch):
    def dummy_download_file(*args, **kwargs):
        raise Exception("S3 error")
    monkeypatch.setattr(storage.s3, "download_file", dummy_download_file)
    with pytest.raises(Exception):
        storage.download_file("fake", "fake")
