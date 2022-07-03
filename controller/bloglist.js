'use strict'
const bloglistRouter = require('express').Router()
const Blog = require('../models/Blog')

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

bloglistRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (!blog.url && !blog.title) {
    return response.status(400).end()
  }
  blog.likes = blog.likes ?? 0
  const savedBlog = await blog.save()
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
    response.status(200).json(doc)
  }
})

module.exports = bloglistRouter
