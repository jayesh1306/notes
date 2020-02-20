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
  }
})

module.exports = mongoose.model('Notes', noteSchema)
