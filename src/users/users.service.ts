import { Injectable } from '@nestjs/common'
import { User } from './user.model'
import { DbService } from '../db/db.service'

@Injectable()
export class UsersService {
  constructor(private db: DbService) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.db.getUser(username)
  }

  async create(
    username: string,
    hashedPassword: string
  ): Promise<User | undefined> {
    return await this.db.createUser(username, hashedPassword)
  }
}
