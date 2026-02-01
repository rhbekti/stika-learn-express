const request = require('supertest')
const app = require('../index')
const prisma = require('../prisma/client')
const bcrypt = require('bcryptjs')

// Mock dependencies
jest.mock('../prisma/client', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn()
  }
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn()
}))

describe('POST /api/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test Case 1: Validation Error
  it('should return 422 if required fields are missing', async () => {
    const res = await request(app).post('/api/register').send({})

    expect(res.statusCode).toEqual(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Validation Error')
  })

  // Test Case 2: Register Success
  it('should return 201 and created user on success', async () => {
    const mockUser = {
      id: 1,
      name: 'New User',
      email: 'new@example.com',
      password: 'hashedpassword'
    }
    
    // Mock findUnique to return null (user doesn't exist)
    prisma.user.findUnique.mockResolvedValue(null)
    bcrypt.hash.mockResolvedValue('hashedpassword')
    prisma.user.create.mockResolvedValue(mockUser)

    const res = await request(app).post('/api/register').send({
      name: 'New User',
      email: 'new@example.com',
      password: 'password123'
    })

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'New User',
        email: 'new@example.com',
        password: 'hashedpassword'
      }
    })
    expect(res.statusCode).toEqual(201)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe('Register successfully')
    expect(res.body.data).toEqual(mockUser)
  })

  // Test Case 3: Database Error (e.g., Unique constraint violation)
  it('should return 500 if database error occurs', async () => {
    const errorMessage = 'Internal server error'
    // Pass validation first
    prisma.user.findUnique.mockResolvedValue(null)
    bcrypt.hash.mockResolvedValue('hashedpassword')
    prisma.user.create.mockRejectedValue(new Error(errorMessage))

    const res = await request(app).post('/api/register').send({
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'password123'
    })

    expect(res.statusCode).toEqual(500)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Internal server error')
  })
})
