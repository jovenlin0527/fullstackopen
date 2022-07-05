'use strict'
const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

const getTokenFormRequest = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const getUserIdFromRequest = async (request) => {
  const token = getTokenFormRequest(request)
  if (token == null) {
    return null
  }
  let { _id } = await User.findByJwtToken(token).select('_id').lean()
  return _id
}

bloglistRouter.post('/', async (request, response) => {
  const userId = await getUserIdFromRequest(request)
  if (userId == null) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const blog = new Blog({ ...request.body, user: userId })
  const savedBlog = await blog.save()
  await savedBlog.populate('user')
  response.status(201).json(savedBlog)
})

bloglistRouter.delete('/:id', async(request, response) => {
  const userId = await getUserIdFromRequest(request)
  if (userId == null) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const blog = await Blog.findById(request.params.id)
  if (blog == null) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.equals(userId)) {
    await blog.remove()
    return response.status(204).end()
  } else {
    return response.status(403).json({ error: 'not the owner' })
  }
})

bloglistRouter.patch('/:id', async(request, response) => {
  const userId = await getUserIdFromRequest(request)
  if (userId == null) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const blog = await Blog.findById(request.params.id)
  if (blog == null) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.equals(userId)) {
    if (request.body.user != null && request.body.user !== userId) {
      return response.status(400).json({ error: 'can\'t change the user' })
    }
    Object.assign(blog, request.body)
    await blog.save()
    return response.status(200).json(blog)
  } else {
    return response.status(403).json({ error: 'not the owner' })
  }
})

bloglistRouter.put('/:id', async(request, response) => {
  const id = request.params.id
  // Built-in replace and update method don't seem to support validation....
  await Blog.validate(request.body)
  const doc = await Blog.findByIdAndUpdate(id, request.body , { overwrite: true, returnDocument: 'after' })
  if (doc == null) {
    response.status(404).json({ error: 'blog not found' })
  } else {
    response.status(200).json(doc)
  }
})

module.exports = bloglistRouter
