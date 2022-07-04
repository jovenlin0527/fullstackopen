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
    const user = await User.findOne({})
    blog.user = user.id
  }
})

blogSchema.post('save', async function () {
  const blog = this
  const user = await User.findById(blog.user)
  if (!user.blogs.some(x => x.id === blog.id)) {
    user.blogs = user.blogs.concat(blog.id)
    user.save()
  }
})


module.exports = mongoose.model('Blog', blogSchema)
