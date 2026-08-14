# CineQueue Backend

This backend provides authentication and CRUD APIs for three user-specific collections and features:

- watchlist
- ongoing
- completed (folders + items inside each folder)
- chatbot (for searching about movies/series/animes information, getting recommendations, etc)


It is built with Express, MongoDB (Mongoose), Redis caching, and JWT + refresh-token cookie auth.

## Tech Stack

- Node.js (CommonJS)
- Express
- MongoDB + Mongoose
- Redis (ioredis)
- JWT
- bcrypt
- cookie-parser
- Tavily API
- Resend API

## Run Locally

```bash
cd backend
npm install
npm run dev
```

Production mode:

```bash
npm start
```

Default port is `8000`.

## Environment Variables

Create `.env` inside `backend/`.

Required keys:

- `PORT`
- `MONGO_URI`
- `MONGO_DB_NAME`
- `password_pepper`
- `jwt_secret_key`
- `refresh_token_pepper`
- `NODE_ENV`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `MailTrap_Token`
- `client_url`

Example:

```dotenv
PORT=8000
MONGO_URI=mongodb+srv://...
MONGO_DB_NAME=kineq
password_pepper=...
jwt_secret_key=...
refresh_token_pepper=...
NODE_ENV=development
REDIS_HOST=...
REDIS_PORT=...
REDIS_PASSWORD=...
Resend_api_token=...
client_url=http://localhost:3000
```

Important: use `KEY=value` format (no spaces around `=`).

## Entry Point

Main server file: `index.js`

Core behavior:

- Connects to MongoDB
- Configures CORS with `client_url`
- Enables JSON, urlencoded body parsing, and cookies
- Mounts route groups under `/api`
- Adds graceful shutdown for HTTP, Redis, and MongoDB

## Authentication Flow

- Login returns access token via `Authorization` response header
- Refresh token is stored in an HTTP-only cookie (`refreshToken`)
- Protected routes use `checkAuthentication` middleware
- If access token is missing/expired, middleware attempts refresh-token based re-issue

## API Route Map

Base URL examples: `http://localhost:8000`

Public:

- `GET /` -> welcome message
- `POST /api/user/signup`
- `POST /api/user/login`
- `POST /api/user/logout`

Protected (require auth middleware):

- Watchlist
- `GET /api/watchlist`
- `GET /api/watchlist/:id`
- `POST /api/watchlist`
- `PATCH /api/watchlist/:id`
- `DELETE /api/watchlist/:id`
- `POST /api/watchlist/:id/move` (moves to ongoing)

- Ongoing
- `GET /api/ongoing`
- `GET /api/ongoing/:id`
- `POST /api/ongoing`
- `PATCH /api/ongoing/:id`
- `DELETE /api/ongoing/:id`
- `POST /api/ongoing/:id/:folderId` (moves to completed folder)

- Completed (folders)
- `GET /api/completed`
- `POST /api/completed`
- `GET /api/completed/:folderId`
- `PATCH /api/completed/:folderId`
- `DELETE /api/completed/:folderId`

- Completed folder contents
- `GET /api/completed/:folderId/contents`
- `POST /api/completed/:folderId/contents`
- `GET /api/completed/:folderId/contents/:id`
- `PATCH /api/completed/:folderId/contents/:id`
- `DELETE /api/completed/:folderId/contents/:id`

- ChatBot
- `POST /api/user/search`

## Caching

Redis is used as a short-lived cache on list/detail endpoints.

- Cache is invalidated on writes (create/update/delete/move)
- Keys are user-scoped
- Also to store Otp during signup for email verification

## Deploying (Render)

No containers needed — this is a plain Node/Express app.

1. Push the repo to GitHub.
2. On Render, create a **New Web Service** from the repo.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all the environment variables listed above in the Render dashboard.
7. Deploy. Render gives you a live URL (e.g. `https://kineq-api.onrender.com`).

A ready-made blueprint (`render.yaml`) is in the repo root — Render will pick up build/start commands and env var names automatically when you connect the repo.

## Backend Directory Guide

- `controllers/` -> nested route logic (completed folder contents)
- `middlewares/` -> auth verification and token refresh handling
- `models/` -> Mongoose schemas
- `routes/` -> API group routes
- `services/` -> JWT helpers, Redis client, mail integration

## Troubleshooting

- 401 with `REFRESH_EXPIRED`: refresh cookie missing/expired
- CORS issues: verify exact `client_url` match and frontend credentials mode
- Env parsing errors: remove spaces around `=` in `.env`
