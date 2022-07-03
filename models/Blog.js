'use strict'

const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (_document, returned) => {
    returned.id = returned._id
    delete returned._id
    delete returned.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
