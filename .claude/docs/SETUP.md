# Mithaq Setup

## 1. Prerequisites

```bash
# Install pgvector for local Postgres
sudo apt install postgresql-16-pgvector  # adjust version to match your pg

# Enable in your database
psql -U postgres -d mithaq -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

## 2. Backend (mithaq-api)

```bash
cd mithaq-api
pnpm install

# Copy env file and fill values
cp .env.example .env

# Fill .env:
#   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
#   JWT_SECRET (any long random string)
#   GEMINI_API_KEY (from Google AI Studio — free)

pnpm start:dev
# API: http://localhost:5000/api
```

## 3. Mobile App (mithaq-app)

```bash
cd mithaq-app
pnpm install

# Set API URL (create this file)
echo 'EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000/api' > .env
echo 'EXPO_PUBLIC_SOCKET_URL=http://YOUR_LOCAL_IP:5000' >> .env

# Use your machine's LAN IP (not localhost) for device testing
# Find it: ip addr show | grep inet

pnpm start
# Press 'a' for Android, 'i' for iOS simulator
```

## 4. Admin Placeholder

```bash
# Open directly in browser — no server needed
open mithaq-admin/index.html
# Wire to real API when building full admin panel
```

## API Routes Summary

```
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me

GET   /api/profile
PUT   /api/profile
POST  /api/profile/purpose
POST  /api/profile/priorities
POST  /api/profile/publish

GET   /api/matches/feed
POST  /api/matches/interest/:userId
GET   /api/matches/mutual

GET   /api/chat/conversations
GET   /api/chat/conversations/:id
POST  /api/chat/conversations/:id/wali

POST  /api/verification/upload
GET   /api/verification/status

GET   /api/admin/stats           (admin JWT required)
GET   /api/admin/verifications
PUT   /api/admin/verifications/:id
GET   /api/admin/users
```

## WebSocket Events (/chat namespace)

```
Client emits:   join_conversation, send_message, typing, stop_typing
Server emits:   new_message, user_typing, user_stop_typing, match_notification
```

## Notes

- `GradientText` requires `@react-native-masked-view/masked-view` — add if not in deps
- Gemini embedding: `text-embedding-004` → 768-dim vectors (free tier, no key cost)
- Auth persists via `expo-secure-store` — survives app restarts
- Mock data in Discover + Messages works without backend running
