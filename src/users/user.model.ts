import { IsStrongPassword, IsNotEmpty } from 'class-validator'

export class User {
  username: string

  hashedPassword: string
}

export class UserLoginDto {
  @IsNotEmpty()
  username: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 2,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsNotEmpty()
  password: string
}
