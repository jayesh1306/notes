const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  message: {
    text: {
      type: String,
      default: null
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Message', messageSchema)
