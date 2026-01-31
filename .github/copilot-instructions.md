# Copilot Instructions for DeepGG Clone

## Project Overview

This is a League of Legends stats tracker web application inspired by deeplol.gg. It uses React + TypeScript for the frontend, Node.js + Express for the backend, Supabase for database, and Docker for deployment.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + React Query
- **Backend**: Node.js 20 + Express + TypeScript
- **Database**: Supabase (PostgreSQL with real-time features)
- **Cache**: Redis (for API rate limiting and response caching)
- **External API**: Riot Games API (rate-limited)
- **Deployment**: Docker + Docker Compose + Nginx

## Build & Run Commands

### Development

```bash
# Backend
cd backend
npm install
npm run dev          # Start dev server with hot reload (tsx watch)

# Frontend
cd frontend
npm install
npm run dev          # Start Vite dev server on http://localhost:5173
```

### Production

```bash
# Build and start with Docker
docker-compose up -d

# Build individually
cd frontend && npm run build    # Outputs to frontend/dist
cd backend && npm run build     # Outputs to backend/dist
```

### Testing & Linting

```bash
npm run lint        # Run ESLint (both frontend and backend)
npm test            # Run tests (when implemented)
```

## Project Structure

```
deepgg-clone/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route components (Home, Profile, Champions)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── services/   # API client services
│   │   ├── types/      # TypeScript type definitions
│   │   └── utils/      # Helper functions
│   └── public/         # Static assets
├── backend/            # Express API server
│   └── src/
│       ├── controllers/  # Request handlers
│       ├── services/     # Business logic
│       ├── routes/       # API route definitions
│       ├── middleware/   # Auth, rate limiting, error handling
│       ├── clients/      # Riot API client wrapper
│       ├── types/        # TypeScript type definitions
│       └── utils/        # Helper functions
├── supabase/
│   └── migrations/     # Database schema migrations (SQL files)
└── docker/             # Dockerfile configurations
```

## Key Architecture Patterns

### Frontend

- **State Management**: React Query for server state, React hooks for local state
- **Routing**: React Router v6 with nested routes
- **API Calls**: Centralized Axios client in `services/` with interceptors for auth and error handling
- **Styling**: TailwindCSS utility classes, shadcn/ui components for complex UI

### Backend

- **Data Flow**: 
  1. Client request → Express route → Controller
  2. Controller → Service layer → Riot API client or Supabase
  3. Check Redis cache first, fallback to API/DB
  4. Store result in cache → Return to controller → Send response
  
- **Rate Limiting**: 
  - Riot API limits: 20 req/sec, 100 req/2min (dev key)
  - Implement request queue in `clients/riotApiClient.ts`
  - Use Redis to track rate limit buckets

- **Caching Strategy**:
  - Summoner data: 5 min TTL
  - Match history: 10 min TTL
  - Match details: Permanent (historical data)
  - Tier lists: 1 hour TTL
  - Static data (champions, items): 24 hour TTL

### Database

- **Schema** (see `supabase/migrations/001_initial_schema.sql`):
  - `summoners` - Player account info
  - `matches` - Match metadata
  - `match_participants` - Player stats per match
  - `champion_stats` - Calculated tier list data

- **Indexes**: Already created on frequently queried fields (puuid, match_id, etc.)
- **RLS Policies**: Enabled but permissive (can be restricted later for auth)

## Important Conventions

### API Endpoints

Follow RESTful conventions:
- `GET /api/summoner/:region/:gameName/:tagLine` - Get summoner profile
- `GET /api/matches/:puuid` - Get match history for player
- `GET /api/match/:matchId` - Get detailed match data
- `GET /api/champions/tierlist/:role` - Get tier list for role (top, jungle, mid, adc, support)
- `GET /api/champions` - Get all champions static data

### TypeScript

- Use explicit types, avoid `any`
- Define interfaces in `types/` directories
- Use type guards for API response validation
- Enable strict mode in tsconfig.json

### Error Handling

- Backend: Use try-catch in controllers, centralized error middleware
- Frontend: React Query handles errors, display user-friendly messages
- Log errors with context (user action, API endpoint, error message)

### Environment Variables

Required in `.env`:
- `RIOT_API_KEY` - From https://developer.riotgames.com/
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` - From Supabase dashboard
- `REDIS_HOST`, `REDIS_PORT` - Redis connection
- `CORS_ORIGIN` - Frontend URL for CORS

### Git Workflow

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Create feature branches from `master`
- Keep commits atomic and focused

## Riot API Integration

### Key Endpoints Used

1. **Account-V1**: Get PUUID from game name + tag
   - `GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`
   
2. **Summoner-V4**: Get summoner info by PUUID
   - `GET /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}`
   
3. **League-V4**: Get ranked stats
   - `GET /lol/league/v4/entries/by-summoner/{encryptedSummonerId}`
   
4. **Match-V5**: Get match history and details
   - `GET /lol/match/v5/matches/by-puuid/{puuid}/ids`
   - `GET /lol/match/v5/matches/{matchId}`

5. **Data Dragon**: Static data (champions, items, runes)
   - `https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json`

### Rate Limit Handling

- Implement exponential backoff for 429 responses
- Queue requests and process within rate limits
- Use Redis to track request counts per time window
- Cache aggressively to minimize API calls

## Common Tasks

### Adding a New API Endpoint

1. Define types in `backend/src/types/`
2. Create service in `backend/src/services/`
3. Create controller in `backend/src/controllers/`
4. Add route in `backend/src/routes/`
5. Register route in `backend/src/index.ts`
6. Create frontend service in `frontend/src/services/`
7. Use React Query hook in component

### Adding a New Page

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Create any new components in `frontend/src/components/`
4. Define TypeScript types in `frontend/src/types/`

### Database Changes

1. Create new migration file in `supabase/migrations/`
2. Name with timestamp: `002_add_new_table.sql`
3. Run in Supabase SQL editor
4. Update types in backend to match schema

## Deployment Notes

- Frontend builds to static files, served by Nginx
- Backend runs as Node.js process in Docker
- Redis runs in separate container
- Supabase is cloud-hosted (not in Docker)
- Environment variables must be set in `.env` before deploying
- Use `docker-compose up -d` for production deployment
