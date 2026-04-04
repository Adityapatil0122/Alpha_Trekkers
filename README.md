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

## Project Structure

```
alpha-trekkers/
├── client/     # React frontend (Vite)
├── server/     # Express backend
└── shared/     # Shared types & constants
```
