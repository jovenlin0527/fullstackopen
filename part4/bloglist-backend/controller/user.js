const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (_request, response) => {
  const users = await User.find({}).populate('blogs')
  response.status(200).json(users)
})

userRouter.post('/', async(request, response) => {
  const userData = request.body
  if (userData.password.length < 3) {
    return response.status(400).json({ error: 'password too short' })
  }
  const user = await User.create(userData)
  response.status(201).json(user)
})

module.exports = userRouter
