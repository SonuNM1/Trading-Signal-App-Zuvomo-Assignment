# Trading Signal Tracker

A full-stack web application to create and track crypto trading signals in real time using the Binance public API. Signals are automatically evaluated every 15 seconds and their status updated based on live market prices.

---

## Architecture Overview

The application follows a clean 3-layer architecture with strict separation of concerns.

### Backend (Node.js + Express)

- `config/` — Database connection, Winston logger, and Sentry error tracking setup
- `models/` — Sequelize ORM model defining the signals table schema
- `validators/` — Zod schema validation for all incoming API requests
- `services/` — Core business logic including signal evaluation, Binance API integration, and background cron job
- `controllers/` — HTTP request and response handling only — no business logic here
- `routes/` — API route definitions wiring URLs to controllers

### Frontend (React + Vite)

- `api/` — Centralized Axios API layer — all backend communication goes through here
- `components/` — Reusable UI components: SignalForm, SignalTable, StatusBadge
- `pages/` — Dashboard page with automatic 15-second data refresh

### Database

- SQLite for local development — zero setup required, file created automatically
- PostgreSQL for production on Render — switched via environment variable

### Background Job

- node-cron runs every 15 seconds to fetch live Binance prices and evaluate all OPEN signals
- Status transitions are permanent — once TARGET_HIT, STOPLOSS_HIT, or EXPIRED, status never reverts

### Monitoring

- Winston for structured persistent file-based logging (combined.log + error.log)
- Sentry for real-time error tracking and alerting

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Database | SQLite (development), PostgreSQL (production) |
| ORM | Sequelize |
| Validation | Zod |
| Frontend | React, Vite, Tailwind CSS (CDN) |
| HTTP Client | Axios |
| Scheduler | node-cron |
| Logging | Winston |
| Error Tracking | Sentry |
| Deployment | Render (backend + DB), Netlify (frontend) |

---

## Local Setup Instructions

### Prerequisites

- Node.js v18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/trading-signal-app.git
cd trading-signal-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
DB_DIALECT=sqlite
DATABASE_URL=
BINANCE_BASE_URL=https://api.binance.com/api/v3
SENTRY_DSN=your_sentry_dsn_here
NODE_ENV=development
```

Start backend server:
```bash
npm run dev
```

**http://localhost:5173**

---

## Database Setup

### Local — SQLite
No setup needed. SQLite database file is created automatically at `backend/database.sqlite` when the server starts for the first time.

### Production — PostgreSQL on Render
1. Create a free PostgreSQL database on Render
2. Copy the External Database URL
3. Set these environment variables in your Render backend service:
```env
DB_DIALECT=postgres
DATABASE_URL=your_render_postgres_connection_string
NODE_ENV=production
```

---


