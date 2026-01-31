# Backend API Documentation

## Overview

The DeepGG Clone backend API provides endpoints for accessing League of Legends player statistics, match history, and champion tier lists via the Riot Games API.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: Configure via Docker Compose

## Authentication

The backend handles authentication with the Riot Games API internally. You need to:

1. Get a Riot Games API key from [https://developer.riotgames.com/](https://developer.riotgames.com/)
2. Add it to your `.env` file: `RIOT_API_KEY=your_key_here`

## Rate Limiting

- **General API endpoints**: 100 requests per minute per IP
- **Expensive operations** (match details): 20 requests per minute per IP

The backend also implements rate limiting for Riot API:
- Development key: 20 requests/second, 100 requests/2 minutes
- Requests are automatically queued and cached to stay within limits

## Caching

All responses are cached in Redis with the following TTLs:
- **Summoner data**: 5 minutes
- **Match history**: 10 minutes
- **Match details**: 7 days (permanent, matches don't change)
- **Champion static data**: 24 hours
- **Tier lists**: 1 hour

## Endpoints

### Health Check

**GET** `/health`

Returns server health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-31T08:52:32.690Z",
  "redis": "configured"
}
```

---

### Get Summoner Profile

**GET** `/api/summoner/:region/:gameName/:tagLine`

Get complete summoner profile including account, summoner, and ranked stats.

**Parameters:**
- `region` (path): Server region (na, euw, eune, kr, br, jp, lan, las, oce, tr, ru)
- `gameName` (path): Summoner game name (e.g., "HideOnBush")
- `tagLine` (path): Summoner tag line (e.g., "KR1")

**Example:**
```bash
curl http://localhost:3001/api/summoner/na/HideOnBush/KR1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "account": {
      "puuid": "...",
      "gameName": "HideOnBush",
      "tagLine": "KR1"
    },
    "summoner": {
      "id": "...",
      "accountId": "...",
      "puuid": "...",
      "name": "HideOnBush",
      "profileIconId": 1234,
      "revisionDate": 1234567890000,
      "summonerLevel": 123
    },
    "rankedStats": [
      {
        "queueType": "RANKED_SOLO_5x5",
        "tier": "CHALLENGER",
        "rank": "I",
        "leaguePoints": 1000,
        "wins": 150,
        "losses": 50
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Summoner not found"
}
```

---

### Get Match History

**GET** `/api/matches/:puuid?region=na&start=0&count=20`

Get match history IDs for a player.

**Parameters:**
- `puuid` (path): Player UUID from summoner profile
- `region` (query, optional): Server region (default: "na")
- `start` (query, optional): Starting index for pagination (default: 0)
- `count` (query, optional): Number of matches to return (max: 100, default: 20)

**Example:**
```bash
curl "http://localhost:3001/api/matches/abc123...?region=na&start=0&count=10"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "matchIds": [
      "NA1_4567890123",
      "NA1_4567890122",
      "..."
    ],
    "pagination": {
      "start": 0,
      "count": 10,
      "total": 10
    }
  }
}
```

---

### Get Match History with Details

**GET** `/api/matches/:puuid/details?region=na&start=0&count=10`

Get match history with full match details in one request.

**Parameters:**
- Same as Get Match History, but `count` max is 20 for performance

**Example:**
```bash
curl "http://localhost:3001/api/matches/abc123.../details?region=na&count=5"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "metadata": { "matchId": "NA1_...", "..." },
        "info": { "gameCreation": 1234567890000, "..." }
      }
    ],
    "pagination": {
      "start": 0,
      "count": 5,
      "total": 5
    }
  }
}
```

---

### Get Match Details

**GET** `/api/match/:matchId?region=na`

Get detailed information for a specific match.

**Parameters:**
- `matchId` (path): Match ID from match history
- `region` (query, optional): Server region (default: "na")

**Example:**
```bash
curl "http://localhost:3001/api/match/NA1_4567890123?region=na"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "metadata": {
      "dataVersion": "2",
      "matchId": "NA1_4567890123",
      "participants": ["puuid1", "puuid2", "..."]
    },
    "info": {
      "gameCreation": 1234567890000,
      "gameDuration": 1800,
      "gameMode": "CLASSIC",
      "participants": [
        {
          "puuid": "...",
          "championName": "Ahri",
          "kills": 10,
          "deaths": 2,
          "assists": 15,
          "win": true,
          "..."
        }
      ],
      "teams": [
        {
          "teamId": 100,
          "win": true,
          "objectives": { "..." }
        }
      ]
    }
  }
}
```

---

### Get All Champions

**GET** `/api/champions`

Get static data for all champions from Data Dragon.

**Example:**
```bash
curl http://localhost:3001/api/champions
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "type": "champion",
    "format": "standAloneComplex",
    "version": "14.1.1",
    "data": {
      "Aatrox": {
        "version": "14.1.1",
        "id": "Aatrox",
        "key": "266",
        "name": "Aatrox",
        "title": "the Darkin Blade",
        "..."
      },
      "..."
    }
  }
}
```

---

### Get Champion by ID

**GET** `/api/champions/:championId`

Get static data for a specific champion.

**Parameters:**
- `championId` (path): Champion ID (e.g., "266" for Aatrox)

**Example:**
```bash
curl http://localhost:3001/api/champions/266
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "version": "14.1.1",
    "id": "Aatrox",
    "key": "266",
    "name": "Aatrox",
    "title": "the Darkin Blade",
    "..."
  }
}
```

---

### Get Tier List by Role

**GET** `/api/champions/tierlist/:role`

Get tier list for a specific role.

**Parameters:**
- `role` (path): Lane role (top, jungle, mid, adc, support)

**Example:**
```bash
curl http://localhost:3001/api/champions/tierlist/mid
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "role": "mid",
    "champions": [
      {
        "championId": "238",
        "championName": "Zed",
        "role": "mid",
        "winRate": 52.5,
        "pickRate": 15.2,
        "banRate": 20.1,
        "gamesPlayed": 15000,
        "tier": "S"
      },
      "..."
    ]
  }
}
```

**Note:** Current implementation returns mock data. In production, this would be calculated from aggregated match data in Supabase.

---

### Get Latest Version

**GET** `/api/version`

Get the latest League of Legends game version.

**Example:**
```bash
curl http://localhost:3001/api/version
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "version": "14.1.1"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

In development mode, errors also include:
- `stack`: Stack trace
- `details`: Additional error details from external APIs

### Common Error Codes

- **400 Bad Request**: Missing or invalid parameters
- **404 Not Found**: Resource not found (summoner, match, etc.)
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: External API (Riot API) is down

---

## Testing with a Valid API Key

1. Get a development API key from [Riot Games Developer Portal](https://developer.riotgames.com/)
2. Update `.env` file:
   ```env
   RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
3. Start the server:
   ```bash
   cd backend
   npm run dev
   ```
4. Test with a real summoner:
   ```bash
   curl http://localhost:3001/api/summoner/na/DoubleLife/NA1
   ```

---

## Development

### Running Locally

```bash
cd backend
npm install
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## Architecture

- **Clients**: Riot API client with rate limiting, Redis cache client
- **Services**: Business logic layer (SummonerService, MatchService, ChampionService)
- **Controllers**: Request handlers with validation
- **Routes**: Express route definitions
- **Middleware**: Error handling, rate limiting, CORS
- **Utils**: Logger, helper functions

## Dependencies

- **express**: Web framework
- **axios**: HTTP client for Riot API
- **redis**: Cache layer
- **express-rate-limit**: Client rate limiting
- **cors**: CORS support
- **dotenv**: Environment variables
