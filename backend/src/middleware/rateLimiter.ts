import rateLimit from 'express-rate-limit'

/**
 * Rate limiter for general API endpoints
 * Limits: 100 requests per minute per IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

/**
 * Stricter rate limiter for expensive operations (e.g., match details)
 * Limits: 20 requests per minute per IP
 */
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests for this endpoint, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
