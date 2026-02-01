const request = require('supertest')
const app = require('../index')
const prisma = require('../prisma/client')
const bcrypt = require('bcryptjs')

// Mock dependencies
jest.mock('../prisma/client', () => ({
  user: {
    findFirst: jest.fn()
  }
}))

jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}))

describe('POST /api/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test Case 1: Validation Error
  it('should return 422 if email or password is missing', async () => {
    const res = await request(app).post('/api/login').send({})
    // Note: Assuming route is /api/login based on controller logic usually attached to /login
    // Wait, let's verify route path. Index.js says app.use('/api', router).
    // I need to check routes/index.js to be sure of the path.
    // For now assuming it is /api/login or similar.
    // Let's assume /api/login for now but I should verify later.
    
    // Actually, looking at index.js, it uses /api prefix. 
    // I will use /api/login in request.
    
    expect(res.statusCode).toEqual(422)
    expect(res.body.success).toBe(false)
  })

  // Test Case 2: User Not Found
  it('should return 404 if user not found', async () => {
    prisma.user.findFirst.mockResolvedValue(null)

    const res = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: expect.any(Object)
    })
    expect(res.statusCode).toEqual(404)
    expect(res.body.message).toBe('User not found')
  })

  // Test Case 3: Invalid Password
  it('should return 401 if password is invalid', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword'
    }
    prisma.user.findFirst.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(false)

    const res = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'wrongpassword'
    })

    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword')
    expect(res.statusCode).toEqual(401)
    expect(res.body.message).toBe('Invalid Password')
  })

  // Test Case 4: Login Success
  it('should return 200 and token on success', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword'
    }
    prisma.user.findFirst.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(true)

    const res = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data.user).not.toHaveProperty('password')
  })
})
