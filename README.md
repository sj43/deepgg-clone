# DeepGG Clone - League of Legends Stats Tracker

A web application for tracking League of Legends player statistics and champion tier lists, inspired by deeplol.gg.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Cache**: Redis
- **APIs**: Riot Games API
- **Deployment**: Docker + Docker Compose

## Features

- 🔍 **Summoner Search** - Find players by game name and tag line
- 👤 **Player Profiles** - View rank, win rate, and most played champions
- 📊 **Match History** - Detailed statistics for recent games
- 🏆 **Champion Tier Lists** - Meta rankings by lane (Top, Jungle, Mid, ADC, Support)
- 🎮 **Match Details** - Full game breakdowns with all players' stats

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Riot Games API key ([Get one here](https://developer.riotgames.com/))
- Supabase account ([Sign up here](https://supabase.com))

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/sj43/deepgg-clone.git
cd deepgg-clone
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `RIOT_API_KEY` - Your Riot Games API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key

### 3. Start services with Docker

```bash
docker-compose up -d
```

### 4. Install dependencies and run development servers

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 5. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

```
deepgg-clone/
├── frontend/           # React + TypeScript frontend
├── backend/            # Node.js + Express API
├── supabase/           # Database migrations
├── docker/             # Docker configurations
├── docker-compose.yml  # Multi-container setup
└── .env.example        # Environment variables template
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Lint code
- `npm test` - Run tests

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Run migrations from `supabase/migrations/` in your Supabase SQL editor
3. Configure environment variables with your Supabase credentials

## API Rate Limits

The Riot API has strict rate limits:
- **Development key**: 20 requests/second, 100 requests/2 minutes
- **Production key**: Higher limits (requires application)

This application implements request queuing and caching to stay within limits.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [deeplol.gg](https://www.deeplol.gg/)
- Powered by [Riot Games API](https://developer.riotgames.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
