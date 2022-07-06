'use strict'

const mongoose = require('mongoose')
const User = require('./user')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    immutable: true,
    required: true,
  }
})

blogSchema.set('toJSON', {
  transform: (_document, returned) => {
    returned.id = returned._id
    delete returned._id
    delete returned.__v
  }
})

blogSchema.pre('save', function() {
  let blog = this
  if (blog.isNew) {
    User.findByIdAndUpdate(blog.user, {
      $push: { blogs: blog._id }
    }, {
      lean: true,
      projection: {}
    }).exec()
  }}
)

module.exports = mongoose.model('Blog', blogSchema)
