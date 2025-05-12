# 1. Pin to the latest patch of Python 3.11 on Debian Bullseye
FROM python:3.11.4-slim-bullseye

# 2. Refresh OS packages, install only ca-certificates, and clean cache
RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install --no-install-recommends -y ca-certificates \
 && rm -rf /lib/apt/lists/*

# 3. Set working directory and install Python dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy application code and define default command
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
