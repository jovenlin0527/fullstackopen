'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 10

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
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

module.exports = mongoose.model('User', userSchema)
