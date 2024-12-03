import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const userDto = { username: 'testuser', password: 'password123' }
      const expectedResult = { message: 'User created successfully' }

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult)

      const result = await controller.register(userDto)

      expect(authService.register).toHaveBeenCalledWith(
        userDto.username,
        userDto.password
      )
      expect(result).toBe(expectedResult)
    })

    it('should throw an error if registration fails', async () => {
      const userDto = { username: 'testuser', password: 'password123' }

      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new Error('Registration failed'))

      await expect(controller.register(userDto)).rejects.toThrow(
        'Registration failed'
      )
    })
  })

  describe('login', () => {
    it('should return user from request object', async () => {
      const req = {
        user: { username: 'testuser' },
      }

      const result = await controller.login(req)

      expect(result).toBe(req.user)
    })
  })
})
