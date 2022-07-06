'use strict'
const mongoose = require('mongoose')

const User = require('../models/user')
const helper = require('./test_helper')
const config = require('../utils/config')

beforeAll(() => mongoose.connect(config.MONGODB_URI))
beforeEach(async () => await helper.initializeUsers())

test('JWT works', async () => {
  const user = await User.findOne({})
  const token = user.getJwtToken()
  const userForToken = await User.findByJwtToken(token)
  expect(userForToken).toEqual(user)
})

afterAll(() => mongoose.disconnect())
