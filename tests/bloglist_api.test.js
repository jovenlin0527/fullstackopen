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

test('Blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('All blogs are returend', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('Blogs have an id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(b => expect(b.id).toBeDefined())
  blogs.forEach(b => expect(b._id).toBeUndefined())
})

test('Can post new blog', async () => {
  const beforeBlogs = await helper.currentBlogs()
  const newBlog = {
    title: 'title',
    author: 'author',
    url: 'http://localhost/',
    likes: 0
  }
  const response = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const receivedBlog = response.body
  const newId = receivedBlog.id

  const afterBlogs = await helper.currentBlogs()
  expect(afterBlogs.length).toBe(beforeBlogs.length + 1)
  const extraBlog = afterBlogs.find(o => o.id === newId)
  expect(extraBlog).toMatchObject(newBlog)
})

afterAll(() => mongoose.connection.close())
