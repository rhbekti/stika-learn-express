const request = require('supertest')
const app = require('../index')
const prisma = require('../prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Mock dependencies
jest.mock('../prisma/client', () => ({
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn()
}))

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn()
}))

describe('User Controller Tests', () => {
  let token

  beforeAll(() => {
    // Generate a mock token for authentication
    token = 'mock-valid-token'
    // Mock jwt.verify to call callback with decoded user (success)
    jwt.verify.mockImplementation((token, secret, cb) => {
      cb(null, { id: 1 })
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    // Re-mock verify in case it was overridden
    jwt.verify.mockImplementation((token, secret, cb) => {
      cb(null, { id: 1 })
    })
  })

  // GET /api/users
  describe('GET /api/users', () => {
    it('should return 200 and list of users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' }
      ]
      prisma.user.findMany.mockResolvedValue(mockUsers)

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveLength(2)
      expect(prisma.user.findMany).toHaveBeenCalled()
    })
  })

  // POST /api/user
  describe('POST /api/user', () => {
    it('should return 201 and created user', async () => {
      const mockUser = { id: 1, name: 'New User', email: 'new@example.com', password: 'hashedpassword' }
      bcrypt.hash.mockResolvedValue('hashedpassword')
      prisma.user.create.mockResolvedValue(mockUser)
      // Need to mock findUnique for validation if it's used there too (likely in validateUser)
      prisma.user.findUnique.mockResolvedValue(null) 

      const res = await request(app)
        .post('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123'
        })
      
      expect(res.statusCode).toEqual(201)
      expect(res.body.success).toBe(true)
      expect(prisma.user.create).toHaveBeenCalled()
    })
  });

  // GET /api/user/:id
  describe('GET /api/user/:id', () => {
    it('should return 200 and user data', async () => {
      const mockUser = { id: 1, name: 'User 1', email: 'user1@example.com' }
      prisma.user.findUnique.mockResolvedValue(mockUser)

      const res = await request(app)
        .get('/api/user/1')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body.data).toEqual(mockUser)
    })
  })

  // PUT /api/user/:id
  describe('PUT /api/user/:id', () => {
    it('should return 200 and updated user', async () => {
      const mockUser = { id: 1, name: 'Updated User', email: 'updated@example.com', password: 'newhashedpassword' }
      bcrypt.hash.mockResolvedValue('newhashedpassword')
      prisma.user.update.mockResolvedValue(mockUser)
      prisma.user.findUnique.mockResolvedValue(null) // For validation uniqueness check

      const res = await request(app)
        .put('/api/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated User',
          email: 'updated@example.com',
          password: 'newpassword123'
        })

      expect(res.statusCode).toEqual(200)
      expect(res.body.data.name).toBe('Updated User')
    })
  })

  // DELETE /api/user/:id
  describe('DELETE /api/user/:id', () => {
    it('should return 200 on successful deletion', async () => {
      prisma.user.delete.mockResolvedValue({})

      const res = await request(app)
        .delete('/api/user/1')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toBe('User deleted successfully')
    })
  })
})
