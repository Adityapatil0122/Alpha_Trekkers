# Alpha Trekkers

A full-stack production-level trekking booking platform for Maharashtra fort treks.

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4
- **Backend:** Node.js + Express 5 + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Icons:** Phosphor Icons
- **State:** Zustand + TanStack React Query

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Start development servers
npm run dev
```

## PostgreSQL Setup

1. Install PostgreSQL and create a database named `alpha_trekkers`.
2. Copy `server/.env.example` to `server/.env`.
3. Set `DATABASE_URL` in `server/.env`, for example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alpha_trekkers?schema=public
```

4. Run Prisma against PostgreSQL:

```bash
npm run db:migrate
npm run db:seed
```

The admin workspace is available at `/admin/trips` for trip editing, pricing changes, schedule management, and trip image management.

## Project Structure

```
alpha-trekkers/
├── client/     # React frontend (Vite)
├── server/     # Express backend
└── shared/     # Shared types & constants
```
