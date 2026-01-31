import { Request, Response, NextFunction } from 'express'
import { ChampionService } from '../services/championService.js'

export class ChampionController {
  private championService: ChampionService

  constructor(championService: ChampionService) {
    this.championService = championService
  }

  /**
   * GET /api/champions
   * Get all champion static data
   */
  getAllChampions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const championData = await this.championService.getAllChampions()

      res.json({
        success: true,
        data: championData,
      })
    } catch (error: any) {
      next(error)
    }
  }

  /**
   * GET /api/champions/:championId
   * Get champion by ID
   */
  getChampionById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { championId } = req.params

      if (!championId) {
        res.status(400).json({
          error: 'Missing required parameter: championId',
        })
        return
      }

      const champion = await this.championService.getChampionById(championId)

      if (!champion) {
        res.status(404).json({
          success: false,
          error: 'Champion not found',
        })
        return
      }

      res.json({
        success: true,
        data: champion,
      })
    } catch (error: any) {
      next(error)
    }
  }

  /**
   * GET /api/champions/tierlist/:role
   * Get tier list for a specific role (top, jungle, mid, adc, support)
   */
  getTierListByRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { role } = req.params

      if (!role) {
        res.status(400).json({
          error: 'Missing required parameter: role',
        })
        return
      }

      const tierList = await this.championService.getTierListByRole(role)

      res.json({
        success: true,
        data: {
          role: role.toLowerCase(),
          champions: tierList,
        },
      })
    } catch (error: any) {
      if (error.message.includes('Invalid role')) {
        res.status(400).json({
          success: false,
          error: error.message,
        })
        return
      }
      next(error)
    }
  }

  /**
   * GET /api/version
   * Get latest game version
   */
  getLatestVersion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const version = await this.championService.getLatestVersion()

      res.json({
        success: true,
        data: { version },
      })
    } catch (error: any) {
      next(error)
    }
  }
}
