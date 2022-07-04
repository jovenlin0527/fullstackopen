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
  if (blog.user == null) {
    const randomUser = await User.findOne({})
    blog.user = randomUser.id
  }
})


module.exports = mongoose.model('Blog', blogSchema)
