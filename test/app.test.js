const request = require('supertest')
const app = require('../index')

describe('App Health Check', () => {
  it('should return 200 OK for the root endpoint', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toContain('Server Works!')
  })
})
