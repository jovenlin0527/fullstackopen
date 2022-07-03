const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require ('../app')
const Blog = require('../models/Blog')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.create(helper.initialBlogs)
})

describe('Get blog list', () => {
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
})

describe('Posting a new blog', () => {
  test('Posted blog is returned correctly', async () => {
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
    expect(receivedBlog).toMatchObject(newBlog)
  })

  test('Posted blog is updated to the db', async () => {
    const beforeBlogs = await helper.currentBlogs()
    const newBlog = {
      title: 'title',
      author: 'author',
      url: 'http://localhost/',
      likes: 0
    }
    const response = await api.post('/api/blogs').send(newBlog)
    const newId = response.body.id

    const afterBlogs = await helper.currentBlogs()
    expect(afterBlogs.length).toBe(beforeBlogs.length + 1)
    const extraBlog = afterBlogs.find(o => o.id === newId)
    expect(extraBlog).toMatchObject(newBlog)
  })

  test('If new blog has no likes, it defaults to 0', async () => {
    const newBlog = {
      title: 'title',
      author: 'author',
      url: 'http://localhost/'
    }
    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(201) // created succesffuly
    expect(response.body.likes).toBe(0)
  })

  test('Do not accept blogs without title and url', async () => {
    const oldBlogs = await helper.currentBlogs()
    const newBlog = {
      author: 'author'
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
    const newBlogs = await helper.currentBlogs()
    expect(newBlogs).toEqual(oldBlogs)
  })
})

afterAll(() => mongoose.connection.close())
