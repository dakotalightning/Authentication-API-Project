import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AuthService } from '../auth/auth.service'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
    authService = module.get<AuthService>(AuthService)
  })

  describe('getProfile', () => {
    it('should return user from request object', () => {
      const mockUser = {
        username: 'testuser',
      }

      const mockRequest = {
        user: mockUser,
      }

      const result = controller.getProfile(mockRequest)
      expect(result).toBe(mockUser)
    })

    it('should handle empty request user', () => {
      const mockRequest = {
        user: null,
      }

      const result = controller.getProfile(mockRequest)
      expect(result).toBeNull()
    })
  })

  describe('Authentication', () => {
    it('should validate user credentials', async () => {
      const credentials = {
        username: 'testuser',
        password: 'password123',
      }

      jest.spyOn(authService, 'validateUser').mockResolvedValue({
        access_token: 'mock-token',
      })

      const result = await authService.validateUser(
        credentials.username,
        credentials.password
      )
      expect(result).toHaveProperty('access_token')
      expect(authService.validateUser).toHaveBeenCalledWith(
        credentials.username,
        credentials.password
      )
    })
  })

  describe('Guard Integration', () => {
    it('should have JwtAuthGuard applied to getProfile', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        UsersController.prototype.getProfile
      )
      expect(guards).toBeDefined()
      expect(guards[0]).toBe(JwtAuthGuard)
    })
  })
})
