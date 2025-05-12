# AI Note Assistant API Documentation

## Endpoints

### 1. POST /transcribe
- **Description:** Upload an audio file for transcription.
- **Request:**
  - Content-Type: multipart/form-data
  - Body: `file` (audio file)
- **Response:**
  - 200 OK
  - `{ "id": "<transcription_id>" }`

---

### 2. GET /transcript/{id}
- **Description:** Retrieve the full transcript for a given transcription ID.
- **Request:**
  - Path parameter: `id` (string)
- **Response:**
  - 200 OK
  - `{ "transcript": "<full transcript text>" }`

---

### 3. POST /summarize
- **Description:** Generate a summary from a transcript.
- **Request:**
  - Content-Type: application/json
  - Body: `{ "transcript": "<transcript text>" }`
- **Response:**
  - 200 OK
  - `{ "summary": "<summary text>" }`

---

### 4. POST /keywords
- **Description:** Extract keywords from a transcript.
- **Request:**
  - Content-Type: application/json
  - Body: `{ "transcript": "<transcript text>" }`
- **Response:**
  - 200 OK
  - `{ "keywords": [ "keyword1", "keyword2", ... ] }`

---

### 5. POST /topics
- **Description:** Classify topics from a transcript.
- **Request:**
  - Content-Type: application/json
  - Body: `{ "transcript": "<transcript text>" }`
- **Response:**
  - 200 OK
  - `{ "topics": [ "topic1", "topic2", ... ] }`

---

## Example Usage

**Transcribe Audio:**
```sh
curl -X POST -F "file=@audio.wav" http://localhost:8000/transcribe
```

**Get Transcript:**
```sh
curl http://localhost:8000/transcript/<id>
```

**Summarize Transcript:**
```sh
curl -X POST -H "Content-Type: application/json" -d '{"transcript": "..."}' http://localhost:8000/summarize
```

**Extract Keywords:**
```sh
curl -X POST -H "Content-Type: application/json" -d '{"transcript": "..."}' http://localhost:8000/keywords
```

**Classify Topics:**
```sh
curl -X POST -H "Content-Type: application/json" -d '{"transcript": "..."}' http://localhost:8000/topics
```

## API Examples

### POST /login
**Request:**
```json
{
  "username": "user1",
  "password": "pass"
}
```
**Response:**
```json
{
  "access_token": "<JWT>"
}
```

### POST /transcribe
**Request:**
Multipart/form-data with audio file as `file` field.
**Response:**
```json
{
  "id": "audio123"
}
```

### GET /transcript/<id>
**Response:**
```json
{
  "transcript": "Full transcript text."
}
```

### POST /summarize
**Request:**
```json
{
  "transcript": "Full transcript text."
}
```
**Response:**
```json
{
  "summary": "Short summary."
}
```

### POST /keywords
**Request:**
```json
{
  "transcript": "Full transcript text."
}
```
**Response:**
```json
{
  "keywords": ["keyword1", "keyword2", ...]
}
```

### POST /topics
**Request:**
```json
{
  "transcript": "Full transcript text."
}
```
**Response:**
```json
{
  "topics": ["business", "technology"]
}
```

### POST /save
**Request:**
```json
{
  "id": "audio123",
  "transcript": "Full transcript text."
}
```
**Response:**
```json
{
  "status": "saved"
}
```

### GET /load/<id>
**Response:**
```json
{
  "transcript": "Full transcript text."
}
```
