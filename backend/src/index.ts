import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { RiotApiClient } from './clients/riotApiClient.js'
import { redisCache } from './clients/redisClient.js'
import { SummonerService } from './services/summonerService.js'
import { MatchService } from './services/matchService.js'
import { ChampionService } from './services/championService.js'
import { SummonerController } from './controllers/summonerController.js'
import { MatchController } from './controllers/matchController.js'
import { ChampionController } from './controllers/championController.js'
import { createSummonerRouter } from './routes/summonerRoutes.js'
import { createMatchRouter } from './routes/matchRoutes.js'
import { createMatchDetailsRouter } from './routes/matchDetailsRoutes.js'
import { createChampionRouter } from './routes/championRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { apiRateLimiter, strictRateLimiter } from './middleware/rateLimiter.js'
import { logger } from './utils/logger.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Validate required environment variables
const requiredEnvVars = ['RIOT_API_KEY']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`)
  process.exit(1)
}

// Initialize clients and services
const riotApiClient = new RiotApiClient(process.env.RIOT_API_KEY!)

const summonerService = new SummonerService(riotApiClient)
const matchService = new MatchService(riotApiClient)
const championService = new ChampionService(riotApiClient)

const summonerController = new SummonerController(summonerService)
const matchController = new MatchController(matchService)
const championController = new ChampionController(championService)

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Apply rate limiting to all API routes
app.use('/api', apiRateLimiter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    redis: redisCache ? 'configured' : 'not configured'
  })
})

// API routes
app.use('/api/summoner', createSummonerRouter(summonerController))
app.use('/api/matches', createMatchRouter(matchController))
app.use('/api/match', strictRateLimiter, createMatchDetailsRouter(matchController))
app.use('/api/champions', createChampionRouter(championController))

// Version endpoint
app.get('/api/version', championController.getLatestVersion)

// 404 handler for undefined routes
app.use(notFoundHandler)

// Global error handler (must be last)
app.use(errorHandler)

// Start server
async function startServer() {
  try {
    // Connect to Redis (optional - app works without it, just without caching)
    try {
      await redisCache.connect()
      logger.info('Redis connected successfully')
    } catch (error) {
      logger.warn('Redis connection failed - continuing without cache', error)
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Backend server running on http://localhost:${PORT}`)
      logger.info(`📝 API documentation: http://localhost:${PORT}/health`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    logger.error('Failed to start server', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  await redisCache.disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully')
  await redisCache.disconnect()
  process.exit(0)
})

startServer()
