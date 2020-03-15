const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  gender: {
    type: Number,
    required: true
  },
  profile: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  lastLogin: {
    type: Date,
    default: Date.now()
  },
  isBlocked: {
    type: Boolean,
    default: 0 //0 = not blocked, 1 = Blocked
  }
})

module.exports = mongoose.model('User', userSchema)
