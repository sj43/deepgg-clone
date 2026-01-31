import { Router } from 'express'
import { ChampionController } from '../controllers/championController.js'

export function createChampionRouter(championController: ChampionController): Router {
  const router = Router()

  // GET /api/champions/tierlist/:role (must be before /:championId to avoid conflicts)
  router.get('/tierlist/:role', championController.getTierListByRole)

  // GET /api/champions
  router.get('/', championController.getAllChampions)

  // GET /api/champions/:championId
  router.get('/:championId', championController.getChampionById)

  return router
}
