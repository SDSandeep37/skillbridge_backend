# SkillBridge Backend

Express + Socket.io + PostgreSQL API for SkillBridge.

## Overview

This service supports:

- User signup/login with role `mentor` or `student`
- JWT authentication via cookies and Bearer header
- Mentor-created sessions, student join, mentor end session
- Code snapshot persistence
- Chat message persistence
- Real-time collaboration via Socket.io

## Quick start

1. `cd skillbridge_backend`
2. `npm install`
3. Create `.env` with:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `JWT_SECRET` (secure token key)
   - `JWT_EXPIRE=1` (optional, hours)
   - `NODE_ENV=development`
4. `npm start`
5. Server runs on `http://localhost:5000`

## API Endpoints

### Users

- `POST /api/users`
  - body: `{ name, email, password, role }`
  - role: `mentor` or `student`

- `POST /api/users/login`
  - body: `{ email, password }`

- `POST /api/users/login-check` (protected)

- `GET /api/users/students` (protected, mentor only)

- `POST /api/users/logout` (protected)

### Sessions

- `POST /api/sessions` (protected, mentor only)
  - body: `{ student, topic }`

- `GET /api/sessions/student` (protected)

- `GET /api/sessions/mentor` (protected)

- `PUT /api/sessions/join-session/:id` (protected)

- `PUT /api/sessions/end-session/:id` (protected, mentor only)

### Code snapshots

- `GET /api/codesnap/:sessionId` (protected)

### Chat

- `GET /api/chat/:sessionId` (protected)

## Socket.io events

- Client <-> server: `join-session`, `code-change`, `cursor-move`, `send-message`
- Optional WebRTC relay: `video-offer`, `video-answer`, `ice-candidate`

## DB schema

Created automatically by `db.js`:

- `users` (id, name, email, password, role, timestamps)
- `sessions` (id, mentor_id, student_id, topic, status, student_joined, timestamps)
- `messages` (id, session_id, sender_id, message, timestamps)
- `code_snapshots` (id, session_id, content, timestamps)

## Notes

- CORS whitelisted origins in `index.js` include local and deployed URLs.
- `authMiddleware.verifyToken` reads token from cookie or `Authorization: Bearer`.
- Cookie settings vary by `NODE_ENV` (secure/sameSite).
