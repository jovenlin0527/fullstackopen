const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (_request, response) => {
  const users = await User.find({})
  response.status(200).json(users)
})

userRouter.post('/', async(request, response) => {
  const userData = request.body
  const user = await User.create(userData)
  response.status(201).json(user)
})

module.exports = userRouter
