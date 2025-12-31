# Task 2: Full Stack Calculation App

A full-stack application that allows users to create and manage calculation trees. Built with Next.js, Express, and PostgreSQL.

## Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Query, Context API
- **Deployment**: Vercel

### Backend

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Deployment**: AWS EC2 (Dockerized)

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm or pnpm

## Getting Started

### Using Docker Compose (Recommended)

To run the entire stack (Frontend, Backend, Database) locally:

```bash
# Navigate to the task-2 directory
cd task-2

# Start services
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

### Manual Setup

#### Backend

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`.env`):
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/ellty_db"
   JWT_SECRET="your_jwt_secret"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`.env.local`):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Frontend (Vercel)

The frontend is deployed on Vercel.

- **Configuration**: `vercel.json` handles rewrites to the backend.
- **Environment Variables**: Ensure `NEXT_PUBLIC_API_URL` is set in Vercel project settings.

### Backend (AWS EC2)

The backend is deployed on an AWS EC2 instance using Docker.

- **CI/CD**: GitHub Actions (if configured) or manual deployment via SSH.
- **Docker**: The backend runs as a containerized service.
