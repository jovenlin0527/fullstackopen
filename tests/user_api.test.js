const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')


const api = supertest(app)

const base_url = '/api/users'

beforeEach(async () => {
  await User.deleteMany({})
})

describe('Create users', () => {
  const newUser = {
    username: 'jason',
    password: 'jason',
    name: 'Jason Lin'
  }
  test('Gets HTTP 201 response with appropriate body', async () => {
    const response = await api.post(base_url)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const createdUser = response.body

    expect(createdUser.username).toBe(newUser.username)
    expect(createdUser.name).toBe(newUser.name)
    expect(createdUser.password).toBeUndefined()
    expect(createdUser.id).toBeDefined()
  })

  test('Correctly create the user in the db', async () => {
    const oldUsers = await User.find({})
    const oldLength = oldUsers.length
    const response = await api.post(base_url).send(newUser)

    const id = response.body.id
    const newUsers = await User.find({})
    expect(newUsers.length).toBe(oldLength + 1)
    const createdUser = newUsers.find(o => o.id === id)
    expect(createdUser.username).toBe(newUser.username)
    expect(createdUser.name).toBe(newUser.name)
    let canLogin = await createdUser.comparePassword(newUser.password)
    expect(canLogin).toBe(true)
    canLogin = await createdUser.comparePassword('')
    expect(canLogin).toBe(false)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
