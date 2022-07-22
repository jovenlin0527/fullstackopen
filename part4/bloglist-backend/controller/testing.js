const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (_request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  return response.status(204).end()
})

testingRouter.post('/createUser', async(request, response) => {
  const newUser = await User.create(request.body)
  response.status(200).json(newUser)
})

module.exports = testingRouter
