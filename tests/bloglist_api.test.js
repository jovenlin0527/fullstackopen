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

describe('Deleting a blog', () => {
  test('Blog is deleted from db', async () => {
    const randomBlog = await Blog.findOne({})
    const id = randomBlog.id
    await api.delete(`/api/blogs/${id}`)

    const deletedBlog = await Blog.findById(id)
    expect(deletedBlog).toBeNull()
  })

  test('HTTP response is 204', async() => {
    const randomBlog = await Blog.findOne({})
    const id = randomBlog.id
    await api.delete(`/api/blogs/${id}`)
      .expect(204)
  })

  test('404 if a nonexistent blog is deleted', async () => {
    const id = await helper.nonexistentId()
    await api.delete(`/api/blogs/${id}`)
      .expect(404)
  })
})

describe('Updating a blog', () => {
  describe('PATCH behaves correctly', () => {
    test('returns a JSON object if successfull', async () => {
      const targetBlog = await Blog.findOne({})
      const id = targetBlog.id
      await api.patch(`/api/blogs/${id}`)
        .send({})
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns the existing object if nothing is updated', async () => {
      const targetBlog = await Blog.findOne({})
      const id = targetBlog.id
      const response = await api.patch(`/api/blogs/${id}`).send({})
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(targetBlog))
    })

    test('updates the existing object in db', async () => {
      const targetBlog = await Blog.findOne({})
      const likes = targetBlog.likes
      const newLikes = likes + 10
      const id = targetBlog.id
      await api.patch(`/api/blogs/${id}`)
        .send({ likes: newLikes })
      const updatedBlog = await Blog.findById(id)
      expect(updatedBlog.likes).toBe(newLikes)
    })

    test('returns the updated object', async () => {
      const targetBlog = await Blog.findOne({})
      const likes = targetBlog.likes
      const newLikes = likes + 10
      const id = targetBlog.id
      const returned = await api.patch(`/api/blogs/${id}`)
        .send({ likes: newLikes })
      const returnedBlog = returned.body
      expect(returnedBlog.likes).toBe(newLikes)
    })

    test('returns 404 if the object is not found', async() => {
      const id = await helper.nonexistentId()
      await api.patch(`/api/blogs/${id}`)
        .send({})
        .expect(404)
    })
  })

  describe('PUT behaves correctly', () => {
    const newBlog = {
      title: 'newTitle',
      author: 'newAuthor',
      url: 'localhost',
      likes: 8000
    }

    test('returns a JSON object if successfull', async () => {
      const randomBlog = await Blog.findOne({})
      const id = randomBlog.id
      await api.put(`/api/blogs/${id}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('updates the existing object in the db', async () => {
      const randomBlog = await Blog.findOne({})
      const id = randomBlog.id
      await api.put(`/api/blogs/${id}`)
        .send(newBlog)
      const updatedBlog = await Blog.findById(id)
      const updatedObj = JSON.parse(JSON.stringify(updatedBlog))
      expect(updatedObj).toMatchObject(newBlog)
    })

    test('returns the updated object', async () => {
      const randomBlog = await Blog.findOne({})
      const id = randomBlog.id
      const response = await api.put(`/api/blogs/${id}`)
        .send(newBlog)
      const updatedBlog = response.body
      expect(updatedBlog).toMatchObject(newBlog)
    })

    test('accepts blogs without a like, defaulting to zero', async () => {
      const newBlog = { title: 'newTitle', author: 'newAuthor', 'url': 'localhost' }
      const expectedBlog = { ...newBlog, likes: 0 }
      const randomBlog = await Blog.findOne({})
      const id = randomBlog.id
      const response = await api.put(`/api/blogs/${id}`)
        .send(newBlog)
        .expect(200) // should success
      expect(response.body).toMatchObject(expectedBlog)
      const updatedBlog = await Blog.findById(id)
      expect(updatedBlog).toMatchObject(expectedBlog)
    })

    test('Do not accept illegal blogs', async() => {
      let badBlog = {}
      const randomBlog = await Blog.findOne({})
      let oldBlog = randomBlog.toObject()
      const id = randomBlog.id
      await api.put(`/api/blogs/${id}`)
        .send(badBlog)
        .expect(400)
      let updatedBlog = await Blog.findById(id)
      expect(updatedBlog.toObject()).toEqual(oldBlog)

    })

    test('returns 404 if no object is found', async () => {
      const id = await helper.nonexistentId()
      await api.put(`/api/blogs/${id}`)
        .send(newBlog)
        .expect(404)
    })
  })
})

afterAll(() => mongoose.connection.close())
