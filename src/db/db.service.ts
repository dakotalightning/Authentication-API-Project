import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { User } from '../users/user.model'

@Injectable()
export class DbService {
  private redis: Redis
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL)
  }

  async getUser(username: string): Promise<User | undefined> {
    const user = await this.redis.get(`user:${username}`)
    if (user) {
      return JSON.parse(user)
    }
    return undefined
  }

  async createUser(
    username: string,
    hashedPassword: string
  ): Promise<User | undefined> {
    const user = {
      username,
      hashedPassword,
    }
    await this.redis.set(`user:${username}`, JSON.stringify(user))
    return user
  }
}
