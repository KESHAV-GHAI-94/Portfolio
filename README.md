# Professional Portfolio

A modern, full-stack portfolio built with Next.js, Prisma, and PostgreSQL.

## Features

- **Dynamic Hero Section**: Interactive 3D elements and animations.
- **Projects Showcase**: Filterable gallery of professional work.
- **Skills Section**: Visual representation of technical expertise.
- **Admin Dashboard**: Secure management of projects, skills, and site settings.
- **Responsive Design**: Optimized for all devices.
- **AI Ready**: Structured for AI integration and content management.

## Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Three.js
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (Local or Docker)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file based on the provided configuration.
4. Sync the database:
   ```bash
   npx prisma db push
   ```
5. Seed the initial data:
   ```bash
   node seed-admin.js
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## License

MIT
