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
  const userId = await getUserIdFromRequest(request)

  if (userId == null) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const oldBlog = await Blog.findById(request.params.id)

  if (oldBlog == null) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!oldBlog.user.equals(userId)) {
    return response.status(403).json({ error: 'not the owner' })
  }

  const newBlog = request.body
  if (newBlog.user) {
    if (!userId.equals(newBlog.user)) {
      return response.status(400).json({ error: 'cannot change the user' })
    }
  } else {
    newBlog.user = userId
  }

  await Blog.validate(newBlog)
  const doc = await Blog.findByIdAndUpdate(oldBlog.id, newBlog, { overwrite: true, returnDocument: 'after' })
  response.status(200).json(doc)
})

module.exports = bloglistRouter
