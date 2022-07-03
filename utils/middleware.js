'use strict'

const logger = require('./logger')

const errorHandler = (error, _request, response, next) => {
  logger.error(error)

  if (error.name === 'ValidationError') {
    response.status(400).json({ error: `invalid format: ${error.message}` })
  }

  next(error)
}

module.exports = { errorHandler }
