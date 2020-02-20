const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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
  notesId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Notes'
    }
  ]
})

module.exports = mongoose.model('User', userSchema)
