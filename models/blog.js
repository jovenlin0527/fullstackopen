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
  }
})

blogSchema.set('toJSON', {
  transform: (_document, returned) => {
    returned.id = returned._id
    delete returned._id
    delete returned.__v
  }
})

blogSchema.pre('save', async function() {
  let blog = this
  if (blog.isNew) {
    const condition = (blog.user != null) ? { _id: blog.user } : {}
    const user = User.findOneAndUpdate(condition, {
      $push: { blogs: blog._id }
    }, {
      lean: true,
      projection: '_id'
    })
    if (blog.user == null) {
      blog.user = (await user)._id
    } else {
      user.exec() // Queries are not promises, we need to exec() it.
    }
  }}
)

module.exports = mongoose.model('Blog', blogSchema)
