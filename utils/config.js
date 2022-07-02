'use strict'

require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/bloglist'

module.exports = { PORT, MONGODB_URI }
