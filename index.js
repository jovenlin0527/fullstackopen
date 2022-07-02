'use strict'

const config = require('./utils/config')
const bloglistRouter = require('./controller/bloglist')
const mongoose = require('mongoose')

const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')

const logger = require('./utils/logger')

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

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
