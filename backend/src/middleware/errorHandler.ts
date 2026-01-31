import { Request, Response, NextFunction } from 'express'
import axios from 'axios'

export interface ApiError extends Error {
  statusCode?: number
  isOperational?: boolean
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err)

  // Default error
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  // Handle Axios errors (from Riot API)
  if (axios.isAxiosError(err)) {
    statusCode = err.response?.status || 500
    
    // Map common Riot API errors to user-friendly messages
    switch (statusCode) {
      case 400:
        message = 'Invalid request parameters'
        break
      case 401:
        message = 'Unauthorized - Invalid API key'
        break
      case 403:
        message = 'Forbidden - API key may have expired or lacks permissions'
        break
      case 404:
        message = 'Resource not found'
        break
      case 429:
        message = 'Rate limit exceeded - Please try again later'
        break
      case 500:
      case 502:
      case 503:
      case 504:
        message = 'External service temporarily unavailable'
        break
      default:
        message = err.response?.data?.message || message
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: axios.isAxiosError(err) ? err.response?.data : undefined,
    }),
  })
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  })
}
