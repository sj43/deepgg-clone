import { Router } from 'express'
import { SummonerController } from '../controllers/summonerController.js'

export function createSummonerRouter(summonerController: SummonerController): Router {
  const router = Router()

  // GET /api/summoner/:region/:gameName/:tagLine
  router.get('/:region/:gameName/:tagLine', summonerController.getSummonerProfile)

  return router
}
