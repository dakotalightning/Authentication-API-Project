// redis-mock.service.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class RedisMockService {
  private store: Map<string, string>
  private isConnected: boolean

  constructor() {
    this.store = new Map()
    this.isConnected = false
  }

  toJSON() {
    return this.store.entries()
  }

  async connect(): Promise<void> {
    this.isConnected = true
  }

  async disconnect(): Promise<void> {
    this.isConnected = false
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    this.store.set(key, value)
    if (ttl) {
      setTimeout(() => {
        this.store.delete(key)
      }, ttl * 1000)
    }
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null
  }

  async del(key: string): Promise<void> {
    this.store.delete(key)
  }

  async flushall(): Promise<void> {
    this.store.clear()
  }
}
