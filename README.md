# KarWaan
KarWaan is a carpooling system useful for employees commuting on the same route.

## Backend

The backend lives in `backend/` and follows the API contract in `team_specification.md`.

### Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env` with MongoDB, JWT, Redis, Google Maps, and Razorpay values before running against real services.

### First Test

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "ok", "service": "karwaan-backend" }
```

### Frontend Contract

Use these base URLs from the frontend:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api
VITE_SOCKET_URL=http://127.0.0.1:5000
```
