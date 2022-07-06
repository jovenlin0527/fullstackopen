'use strict'
const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

const getUserIdFromRequest = async (request) => {
  return request?.user?._id
}

bloglistRouter.post('/', async (request, response) => {
  const user = request.user
  if (user == null) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const blog = new Blog({ ...request.body, user: user.id })
  const savedBlog = await blog.save()
  await savedBlog.populate('user')
  response.status(201).json(savedBlog)
})

bloglistRouter.delete('/:id', async(request, response) => {
  const user = request.user
  if (user == null) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const blog = await Blog.findById(request.params.id)
  if (blog == null) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.equals(user.id)) {
    await blog.remove()
    return response.status(204).end()
  } else {
    return response.status(403).json({ error: 'not the owner' })
  }
})

bloglistRouter.patch('/:id', async(request, response) => {
  const user = request.user
  if (user == null) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const blog = await Blog.findById(request.params.id)
  if (blog == null) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.equals(user.id)) {
    if (request.body.user != null && request.body.user !== user.id) {
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
  const user = request.user
  if (user == null) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const oldBlog = await Blog.findById(request.params.id)
  if (oldBlog == null) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (!oldBlog.user.equals(user.id)) {
    return response.status(403).json({ error: 'not the owner' })
  }

  const newBlog = request.body
  if (newBlog.user) {
    if (!user._id.equals(newBlog.user)) {
      return response.status(400).json({ error: 'cannot change the user' })
    }
  } else {
    newBlog.user = user._id
  }

  await Blog.validate(newBlog)
  const doc = await Blog.findByIdAndUpdate(oldBlog.id, newBlog, { overwrite: true, returnDocument: 'after' })
  response.status(200).json(doc)
})

module.exports = bloglistRouter
