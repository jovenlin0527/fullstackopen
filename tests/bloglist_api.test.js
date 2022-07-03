const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require ('../app')
const Blog = require('../models/Blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Promise.all(helper.initialBlogs.map(x => Blog.create(x)))
})

afterAll(() => mongoose.connection.close())
