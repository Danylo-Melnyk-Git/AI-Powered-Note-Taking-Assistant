"""
Storage utility functions for file upload and download using AWS S3.
"""

import boto3
import logging

from .config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)


def upload_file(file_path, destination):
    """Upload a file to the S3 bucket."""
    try:
        s3.upload_file(file_path, S3_BUCKET_NAME, destination)
        return f"s3://{S3_BUCKET_NAME}/{destination}"
    except Exception as e:
        logging.exception(f"S3 upload failed: {file_path} -> {destination}")
        raise


def download_file(file_key, destination):
    """Download a file from the S3 bucket."""
    try:
        s3.download_file(S3_BUCKET_NAME, file_key, destination)
        return destination
    except Exception as e:
        logging.exception(f"S3 download failed: {file_key} -> {destination}")
        raise
