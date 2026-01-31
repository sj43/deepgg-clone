import { Router } from 'express'
import { MatchController } from '../controllers/matchController.js'

export function createMatchRouter(matchController: MatchController): Router {
  const router = Router()

  // GET /api/matches/:puuid
  router.get('/:puuid', matchController.getMatchHistory)

  // GET /api/matches/:puuid/details
  router.get('/:puuid/details', matchController.getMatchHistoryWithDetails)

  return router
}
