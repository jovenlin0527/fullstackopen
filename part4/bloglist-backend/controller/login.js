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
  const token = user.getJwtToken()

  response.status(200)
    .json({ token, username, name: user.name })
})

module.exports = loginRouter
