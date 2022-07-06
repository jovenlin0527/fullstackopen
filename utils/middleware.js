'use strict'

const logger = require('./logger')

const errorHandler = (error, _request, response, next) => {
  logger.error(error)

  if (error.name === 'ValidationError') {
    response.status(400).json({ error: `invalid format: ${error.message}` })
  }

  next(error)
}

const tokenExtracter = (request, _response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

module.exports = { errorHandler, tokenExtracter }
