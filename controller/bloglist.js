'use strict'
const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

bloglistRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  await savedBlog.populate('user')
  response.status(201).json(savedBlog)
})

bloglistRouter.delete('/:id', async(request, response) => {
  const doc = await Blog.findByIdAndDelete(request.params.id)
  if (doc == null) {
    response.status(404).json({ error: 'blog not found' })
  } else {
    response.status(204).end()
  }
})

bloglistRouter.patch('/:id', async(request, response) => {
  const id = request.params.id
  const newBlog = request.body
  const doc = await Blog.findByIdAndUpdate(id, newBlog, { returnDocument: 'after' })
  if (doc == null) {
    response.status(404).json({ error: 'blog not found' })
  } else {
    await doc.populate()
    response.status(200).json(doc)
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
