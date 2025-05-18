import pytest
import os
import tempfile

@pytest.fixture(scope="function")
def test_app():
    # Create a temporary file for SQLite in-memory DB
    db_fd, db_path = tempfile.mkstemp()
    os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"

    # Import your Flask app here
    from backend.app import app as flask_app  # Adjust import if needed
    flask_app.config['TESTING'] = True

    with flask_app.test_client() as client:
        yield client

    os.close(db_fd)
    os.unlink(db_path)
