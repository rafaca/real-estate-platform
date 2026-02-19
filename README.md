# FindHome - Real Estate Platform

A modern real estate search platform built with Next.js, featuring intelligent search, real-time notifications, and comprehensive neighborhood insights.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand + React Query
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (local or cloud)
- pnpm (recommended)

### Installation

1. **Clone and install dependencies:**

```bash
cd real-estate-app
pnpm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your database URL and other credentials.

3. **Set up the database:**

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Seed with sample data
pnpm db:seed
```

4. **Start the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
real-estate-app/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data script
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Homepage
│   ├── components/
│   │   ├── home/          # Homepage sections
│   │   ├── layout/        # Header, Footer
│   │   └── ui/            # Reusable UI components
│   ├── lib/
│   │   ├── prisma.ts      # Prisma client
│   │   ├── trpc/          # tRPC client
│   │   └── utils.ts       # Utility functions
│   └── server/
│       ├── trpc.ts        # tRPC setup
│       └── routers/       # API routers
├── package.json
└── tsconfig.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema changes |
| `pnpm db:migrate` | Create migration |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed database |

## Features

### Implemented (MVP)
- [x] Project setup with Next.js 15 + TypeScript
- [x] Tailwind CSS 4 styling
- [x] Homepage with hero, featured listings, cities
- [x] tRPC API setup
- [x] Prisma database schema
- [x] Basic UI components (Button, Input, Card)

### Coming Soon
- [ ] Search page with filters
- [ ] Map integration (Mapbox)
- [ ] User authentication (Clerk)
- [ ] Saved searches & favorites
- [ ] Notification system
- [ ] Agent dashboard

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox access token |
| `OPENAI_API_KEY` | OpenAI API key (for NLP search) |

## Database Setup

### Local PostgreSQL

```bash
# Create database
createdb realestate

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/realestate"
```

### Cloud Options
- [Neon](https://neon.tech) - Serverless PostgreSQL (recommended)
- [Supabase](https://supabase.com) - PostgreSQL + extras
- [Railway](https://railway.app) - Simple hosting

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```dockerfile
# Coming soon
```

## License

MIT
