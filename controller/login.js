const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  const loginSucess = user && await user.comparePassword(password)
  if (!loginSucess) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }
  const userForToken = { username, id: user._id }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200)
    .json({ token, username })
})

module.exports = loginRouter
