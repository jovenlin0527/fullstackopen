const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const User = require('../models/user')
const Blog = require('../models/blog')

const helper = require('./test_helper')
const api = supertest(app)

test.only('Can reset the database', async () => {
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

afterAll(() => mongoose.connection.close())
