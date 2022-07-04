const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async(request, response) => {
  const userData = request.body
  const user = await User.create(userData)
  response.status(201).json(user)
})

module.exports = userRouter
