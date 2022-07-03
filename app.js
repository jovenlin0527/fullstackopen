'use strict'

const config = require('./utils/config')

const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const bloglistRouter = require('./controller/bloglist')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

logger.info('connecting to MongoDB')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('MongoDB connected')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', bloglistRouter)

app.use(middleware.errorHandler)

module.exports = app
