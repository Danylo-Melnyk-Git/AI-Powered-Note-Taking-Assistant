import pytest
from app import app as flask_app

@pytest.mark.parametrize("payload", [
    {},
    {"transcript": 123},
    {"transcript": None},
    {"transcript": ""},
    {"foo": "bar"},
])
def test_summarize_schema_validation(payload):
    with flask_app.test_client() as client:
        # Assume a valid JWT is set for testing, or mock jwt_required
        response = client.post("/summarize", json=payload)
        assert response.status_code == 422 or response.status_code == 400
