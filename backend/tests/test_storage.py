"""
Test for storage module: function existence.
"""

import backend.utils.storage as storage


def test_upload_file_exists():
    assert hasattr(storage, "upload_file")


def test_download_file_exists():
    assert hasattr(storage, "download_file")
