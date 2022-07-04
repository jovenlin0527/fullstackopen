const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')

const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(helper.initializeUsers)

const user = helper.initialUsers[0]

describe('Good login', () => {
  test('Valid response', async () => {
    const loginInfo = { username: user.username, password: user.password }
    const response = await api.post('/api/login')
      .send(loginInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const info = response.body

    expect(info.username).toBe(user.username)
    expect(info).not.toHaveProperty('id')
    expect(info.token).toEqual(expect.any(String))
  })

  test('The JWT token is linked to the logged user', async () => {
    const loginInfo = { username: user.username, password: user.password }
    const response = await api.post('/api/login').send(loginInfo)
    const token = response.body.token
    const userForToken = await User.fromJwtToken(token)
    expect(userForToken.username).toBe(loginInfo.username)
  })
})

describe('Bad login', () => {
  test('Wrong username', async () => {
    const loginInfo = { username: user.username + 'a' , password: user.password }
    await api.post('/api/login')
      .send(loginInfo)
      .expect(401)
  })

  test('Wrong password', async () => {
    const loginInfo = { username: user.username, password: user.password + 'a' }
    await api.post('/api/login')
      .send(loginInfo)
      .expect(401)
  })

})

afterAll(() => {
  mongoose.disconnect()
})
