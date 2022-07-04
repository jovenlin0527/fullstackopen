const _ = require('lodash')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

const base_url = '/api/users'

beforeEach(helper.initializeUsers)

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

describe('Create invalid users', () => {
  const newUser = {
    username: 'jason',
    password: 'jason',
    name: 'Jason Lin'
  }

  const postAndCheckResponse = async (user) => {
    const response = await api.post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    return response
  }

  const checkNoUserIsAdded = async () => {
    const currentUser = await User.find({})
    expect(currentUser.length).toBe(helper.initialUsers.length)
  }

  test('does not accept short username', async () => {
    const response = await postAndCheckResponse( { ...newUser, username: 'a' } )
    const errorMsg = response.body.error
    expect(errorMsg).toBeDefined()
    expect(errorMsg).toContain('username')
    expect(errorMsg).toContain('short')
    await checkNoUserIsAdded()
  })

  test('does not accept short password', async () => {
    const response = await postAndCheckResponse( { ...newUser, password: 'a' } )
    const errorMsg = response.body.error
    expect(errorMsg).toBeDefined()
    expect(errorMsg).toContain('password')
    expect(errorMsg).toContain('short')
    await checkNoUserIsAdded()
  })

  test('username must be unique', async () => {
    const existingUser = helper.initialUsers[0]
    const response = await postAndCheckResponse(existingUser)
    const errorMsg = response.body.error
    expect(errorMsg).toBeDefined()
    expect(errorMsg).toContain('username')
    expect(errorMsg).toContain('unique')
    await checkNoUserIsAdded()
  })
})

describe('List users', () => {
  test('HTTP 200 response in json', async () => {
    await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns every user, without their passowrds', async () => {
    const response = await api.get('/api/users')
    const users = response.body
    expect(users.length).toBe(helper.initialUsers.length)
    const userTable = _.chain(users)
      .sortBy(o => o.name)
      .map(user => {
        user = { ...user }
        delete user.id
        return user
      })
      .value()
    const initialTable = _.chain(helper.initialUsers)
      .sortBy(o => o.name)
      .map(user => {
        user = { ...user }
        delete user.password
        return user
      })
      .value()
    expect(userTable).toEqual(initialTable)
  })

  test('returned users have an id field', async () => {
    const response = await api.get('/api/users')
    expect(response.body[0].id).toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
