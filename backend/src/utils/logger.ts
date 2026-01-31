/**
 * Logger utility for consistent logging across the application
 */

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString()
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    const timestamp = this.getTimestamp()
    const logMessage = `[${timestamp}] [${level}] ${message}`

    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage, meta || '')
        break
      case LogLevel.WARN:
        console.warn(logMessage, meta || '')
        break
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV === 'development') {
          console.debug(logMessage, meta || '')
        }
        break
      default:
        console.log(logMessage, meta || '')
    }
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta)
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta)
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta)
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta)
  }
}

export const logger = new Logger()
