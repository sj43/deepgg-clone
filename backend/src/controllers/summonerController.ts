import { Request, Response, NextFunction } from 'express'
import { SummonerService } from '../services/summonerService.js'

export class SummonerController {
  private summonerService: SummonerService

  constructor(summonerService: SummonerService) {
    this.summonerService = summonerService
  }

  /**
   * GET /api/summoner/:region/:gameName/:tagLine
   * Get summoner profile by game name and tag line
   */
  getSummonerProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { region, gameName, tagLine } = req.params

      if (!region || !gameName || !tagLine) {
        res.status(400).json({
          error: 'Missing required parameters: region, gameName, tagLine',
        })
        return
      }

      const profile = await this.summonerService.getSummonerProfile(
        gameName,
        tagLine,
        region.toLowerCase()
      )

      res.json({
        success: true,
        data: profile,
      })
    } catch (error: any) {
      if (error.response?.status === 404) {
        res.status(404).json({
          success: false,
          error: 'Summoner not found',
        })
        return
      }
      next(error)
    }
  }
}
