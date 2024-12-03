import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (!user || !user.hashedPassword) {
      return null
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword)
    if (isMatch) {
      const payload = { username: user.username }
      return {
        access_token: this.jwtService.sign(payload),
      }
    }
    return null
  }

  async register(username: string, password: string) {
    const exists = await this.usersService.findOne(username)
    if (exists) {
      throw new BadRequestException('Username already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 16)
    await this.usersService.create(username, hashedPassword)
    return { message: 'User created successfully' }
  }
}
