import { Request, Response, NextFunction } from 'express'
import { MatchService } from '../services/matchService.js'

export class MatchController {
  private matchService: MatchService

  constructor(matchService: MatchService) {
    this.matchService = matchService
  }

  /**
   * GET /api/matches/:puuid?region=na&start=0&count=20
   * Get match history for a player
   */
  getMatchHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { puuid } = req.params
      const region = (req.query.region as string) || 'na'
      const start = parseInt(req.query.start as string) || 0
      const count = Math.min(parseInt(req.query.count as string) || 20, 100)

      if (!puuid) {
        res.status(400).json({
          error: 'Missing required parameter: puuid',
        })
        return
      }

      const matchIds = await this.matchService.getMatchHistory(
        puuid,
        region.toLowerCase(),
        start,
        count
      )

      res.json({
        success: true,
        data: {
          matchIds,
          pagination: {
            start,
            count,
            total: matchIds.length,
          },
        },
      })
    } catch (error: any) {
      next(error)
    }
  }

  /**
   * GET /api/match/:matchId?region=na
   * Get detailed match information
   */
  getMatchDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { matchId } = req.params
      const region = (req.query.region as string) || 'na'

      if (!matchId) {
        res.status(400).json({
          error: 'Missing required parameter: matchId',
        })
        return
      }

      const match = await this.matchService.getMatchDetails(
        matchId,
        region.toLowerCase()
      )

      res.json({
        success: true,
        data: match,
      })
    } catch (error: any) {
      if (error.response?.status === 404) {
        res.status(404).json({
          success: false,
          error: 'Match not found',
        })
        return
      }
      next(error)
    }
  }

  /**
   * GET /api/matches/:puuid/details?region=na&start=0&count=10
   * Get match history with full details
   */
  getMatchHistoryWithDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { puuid } = req.params
      const region = (req.query.region as string) || 'na'
      const start = parseInt(req.query.start as string) || 0
      const count = Math.min(parseInt(req.query.count as string) || 10, 20)

      if (!puuid) {
        res.status(400).json({
          error: 'Missing required parameter: puuid',
        })
        return
      }

      const matches = await this.matchService.getMatchHistoryWithDetails(
        puuid,
        region.toLowerCase(),
        start,
        count
      )

      res.json({
        success: true,
        data: {
          matches,
          pagination: {
            start,
            count,
            total: matches.length,
          },
        },
      })
    } catch (error: any) {
      next(error)
    }
  }
}
