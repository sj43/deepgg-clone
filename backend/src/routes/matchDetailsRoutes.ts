import { Router } from 'express'
import { MatchController } from '../controllers/matchController.js'

export function createMatchDetailsRouter(matchController: MatchController): Router {
  const router = Router()

  // GET /api/match/:matchId
  router.get('/:matchId', matchController.getMatchDetails)

  return router
}
