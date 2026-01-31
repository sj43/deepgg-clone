import { createClient, RedisClientType } from 'redis'

export class RedisCache {
  private client: RedisClientType | null = null
  private isConnected = false

  async connect(): Promise<void> {
    if (this.isConnected) return

    const redisHost = process.env.REDIS_HOST || 'localhost'
    const redisPort = parseInt(process.env.REDIS_PORT || '6379')

    this.client = createClient({
      socket: {
        host: redisHost,
        port: redisPort,
      },
    })

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    this.client.on('connect', () => {
      console.log('✅ Redis connected successfully')
      this.isConnected = true
    })

    this.client.on('disconnect', () => {
      console.log('⚠️  Redis disconnected')
      this.isConnected = false
    })

    await this.client.connect()
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit()
      this.isConnected = false
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) {
      console.warn('Redis not connected, skipping cache get')
      return null
    }

    try {
      const data = await this.client.get(key)
      if (!data) return null
      return JSON.parse(data) as T
    } catch (error) {
      console.error(`Error getting cache key ${key}:`, error)
      return null
    }
  }

  /**
   * Set value in cache with TTL in seconds
   */
  async set(key: string, value: any, ttl: number): Promise<void> {
    if (!this.client || !this.isConnected) {
      console.warn('Redis not connected, skipping cache set')
      return
    }

    try {
      await this.client.setEx(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting cache key ${key}:`, error)
    }
  }

  /**
   * Delete key from cache
   */
  async delete(key: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }

    try {
      await this.client.del(key)
    } catch (error) {
      console.error(`Error deleting cache key ${key}:`, error)
    }
  }

  /**
   * Delete keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }

    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(keys)
      }
    } catch (error) {
      console.error(`Error deleting cache pattern ${pattern}:`, error)
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false
    }

    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      console.error(`Error checking cache key ${key}:`, error)
      return false
    }
  }

  /**
   * Get TTL of a key
   */
  async ttl(key: string): Promise<number> {
    if (!this.client || !this.isConnected) {
      return -1
    }

    try {
      return await this.client.ttl(key)
    } catch (error) {
      console.error(`Error getting TTL for key ${key}:`, error)
      return -1
    }
  }
}

// Singleton instance
export const redisCache = new RedisCache()
