'use strict'
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')

const saltRounds = 10

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  blogs: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
    ref: 'Blog'
  }
})

userSchema.set('toJSON', {
  transform: (_doc, returnedObj) => {
    returnedObj.id = returnedObj._id
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.password
  }
})

// https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
userSchema.pre('save', async function (_next) {
  let user = this
  if (user.isModified('password')) {
    const hash = await bcrypt.hash(user.password, saltRounds)
    user.password = hash
  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.getJwtToken = function() {
  const userInfo = { username: this.username, id: this._id }
  return jwt.sign(userInfo, process.env.SECRET)
}

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

User.findByJwtToken = (token) => {
  if (token == null) {
    return null
  }
  const { username, id } = jwt.verify(token, process.env.SECRET)
  return User.findOne( { _id: id, username } )
}

module.exports = mongoose.model('User', userSchema)
