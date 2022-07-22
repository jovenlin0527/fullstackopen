'use strict'

const mongoose = require('mongoose')

const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const attr_eq = (l, r) => {
  if (l instanceof mongoose.Types.ObjectId) {
    return l.equals(r)
  }
  if (r instanceof mongoose.Types.ObjectId) {
    return r.equals(l)
  }
  return l === r
}

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

  const oldBlog = await Blog.findById(request.params.id).lean()
  if (oldBlog == null) {
    return response.status(404).json({ error: 'blog not found' })
  }
  oldBlog.id = oldBlog._id
  delete oldBlog._id
  delete oldBlog.__v
  const newBlog = request.body

  if (!oldBlog.user.equals(user.id)) {
    // Only allow change likes
    for (const key in oldBlog) {
      switch (key) {
      case 'id':
        /* fallthrough */
      case 'user':
        break
      case 'likes': // Only this attribute can be changed.
        if ( typeof newBlog.likes !== 'number' || newBlog.likes < oldBlog.likes ){
          return response.status(403).json({ error: 'non-owner can only increase likes' })
        }
        break
      default:
        if (!attr_eq(newBlog[key], oldBlog[key])) {
          return response.status(403).json({ error: `non-owner cannot change attribute ${key}` })
        }

      }
    }
  }
  if (newBlog.id != null){
    if (newBlog.id !== request.params.id) {
      return response.status(400).json({ error: 'cannot change id' })
    }
  } else {
    newBlog.id = oldBlog.id
  }

  if (newBlog.user) {
    if (!attr_eq(newBlog.user, oldBlog.user)) {
      return response.status(400).json({ error: 'cannot change the user' })
    }
  } else {
    newBlog.user = oldBlog.user
  }

  await Blog.validate(newBlog)
  const doc = await Blog.findByIdAndUpdate(oldBlog.id, newBlog, { overwrite: true, returnDocument: 'after' })
  response.status(200).json(doc)
})

module.exports = bloglistRouter
