import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../users/users.service'
import { DbService } from '../db/db.service'
import { User } from './user.model'

describe('UsersService', () => {
  let service: UsersService
  let dbService: DbService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DbService,
          useValue: {
            getUser: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    dbService = module.get<DbService>(DbService)
  })

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const mockUser: User = {
        username: 'testuser',
        hashedPassword: 'hashedpass123',
      }

      jest.spyOn(dbService, 'getUser').mockResolvedValue(mockUser)

      const result = await service.findOne('testuser')
      expect(result).toBe(mockUser)
      expect(dbService.getUser).toHaveBeenCalledWith('testuser')
    })

    it('should return undefined when user not found', async () => {
      jest.spyOn(dbService, 'getUser').mockResolvedValue(undefined)

      const result = await service.findOne('nonexistent')
      expect(result).toBeUndefined()
      expect(dbService.getUser).toHaveBeenCalledWith('nonexistent')
    })

    it('should propagate errors from db service', async () => {
      jest.spyOn(dbService, 'getUser').mockRejectedValue(new Error('DB error'))

      await expect(service.findOne('testuser')).rejects.toThrow('DB error')
    })
  })

  describe('create', () => {
    it('should create and return a new user', async () => {
      const mockUser: User = {
        username: 'newuser',
        hashedPassword: 'hashedpass456',
      }

      jest.spyOn(dbService, 'createUser').mockResolvedValue(mockUser)

      const result = await service.create('newuser', 'hashedpass456')
      expect(result).toBe(mockUser)
      expect(dbService.createUser).toHaveBeenCalledWith(
        'newuser',
        'hashedpass456'
      )
    })

    it('should return undefined when creation fails', async () => {
      jest.spyOn(dbService, 'createUser').mockResolvedValue(undefined)

      const result = await service.create('newuser', 'hashedpass456')
      expect(result).toBeUndefined()
    })

    it('should propagate errors from db service', async () => {
      jest
        .spyOn(dbService, 'createUser')
        .mockRejectedValue(new Error('Creation failed'))

      await expect(service.create('newuser', 'hashedpass456')).rejects.toThrow(
        'Creation failed'
      )
    })
  })
})
