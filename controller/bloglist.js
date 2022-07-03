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

module.exports = bloglistRouter
