# Stage 1: Build React frontend
FROM node:18.20.3-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Python backend
FROM python:3.11.9-slim AS backend-build
WORKDIR /app/backend
COPY backend/ ./
COPY --from=frontend-build /app/frontend/build ./static
# Use poetry for dependency management if pyproject.toml exists
RUN pip install --upgrade pip && \
    if [ -f pyproject.toml ]; then pip install poetry && poetry install --no-dev --no-interaction --no-ansi; else pip install -r requirements.txt; fi

# Stage 3: Production image with Nginx
FROM nginx:alpine AS production
WORKDIR /app
COPY --from=backend-build /app/backend /app/backend
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html
COPY backend/nginx.conf /etc/nginx/nginx.conf

# Expose backend and frontend ports
EXPOSE 8000 80

# Start backend (gunicorn) and nginx
CMD ["sh", "-c", "cd /app/backend && gunicorn -b 0.0.0.0:8000 app:app & nginx -g 'daemon off;'"]
