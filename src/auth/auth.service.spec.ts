import { Test } from '@nestjs/testing'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app.module'
import { DbService } from '../db/db.service'
import { RedisMockService } from '../jest/redis-mock.service'

let mockDbService = {
  getUser: async (username: string) => undefined,
  createUser: async (username: string, hashedPassword: string) => undefined,
}

const newService = (mockedRedis: RedisMockService) => ({
  getUser: async (username: string) => {
    const user = await mockedRedis.get(`test_user:${username}`)
    if (user) {
      return JSON.parse(user)
    }
    return undefined
  },
  createUser: async (username: string, hashedPassword: string) => {
    const user = {
      username,
      hashedPassword,
    }
    await mockedRedis.set(`test_user:${username}`, JSON.stringify(user))
    return user
  },
})

describe('Authentication (e2e)', () => {
  let app: INestApplication
  let mockedRedis: RedisMockService

  beforeAll(async () => {
    mockedRedis = new RedisMockService()
    mockDbService = newService(mockedRedis)

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DbService)
      .useValue(mockDbService)
      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      })
    )
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('/auth/register (POST)', () => {
    it('should create a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'Test123!' })
        .expect(201)
    })

    it('should fail with weak password', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'weak' })
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should fail if username already exists', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'Test123!' })
        .expect(HttpStatus.BAD_REQUEST)
    })
  })

  describe('/auth/login (POST)', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'Test123!' })
    })

    it('should return JWT token for valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'Test123!' })
        .expect(HttpStatus.CREATED)

      expect(response.body.access_token).toBeDefined()
    })

    it('should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrong' })
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })

  describe('Protected Routes', () => {
    let authToken: string

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'Test123!' })

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'Test123!' })
      authToken = response.body.access_token
    })

    it('should access protected route with valid token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
    })

    it('should fail to access protected route without token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })
})
