const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})

module.exports = mongoose.model('Notes', noteSchema)
