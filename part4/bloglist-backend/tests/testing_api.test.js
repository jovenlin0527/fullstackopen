const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const User = require('../models/user')
const Blog = require('../models/blog')

const helper = require('./test_helper')
const api = supertest(app)

test('Can reset the database', async () => {
  await helper.initializeDb()
  const [user, blog] = await Promise.all( [
    User.findOne({}).lean(),
    Blog.findOne({}).lean()
  ])
  expect(user).not.toBeNull()
  expect(blog).not.toBeNull()
  await api.post('/api/testing/reset')
  const [userAfter, blogAfter] = await Promise.all( [
    User.findOne({}).lean(),
    Blog.findOne({}).lean()
  ] )
  expect(userAfter).toBeNull()
  expect(blogAfter).toBeNull()
})

test('Can create user', async () => {
  await api.post('/api/testing/reset')
  const newUser = helper.newUser
  const { body: responseUser } = await api.post('/api/testing/createUser')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(responseUser).toMatchObject({ username: newUser.username, name: newUser.name })
  expect(typeof responseUser.id).toBe('string')
  const userInDb = await User.findById(responseUser.id).lean()
  userInDb.id = userInDb._id.toString()
  delete userInDb._id
  expect(userInDb).toMatchObject(responseUser)
})

afterAll(() => mongoose.connection.close())
