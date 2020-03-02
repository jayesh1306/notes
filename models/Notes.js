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
  code: {
    type: String,
    required: true
  },
  scheme: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Notes', noteSchema)
