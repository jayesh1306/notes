var mongoose = require('mongoose')

var SalesNotesSchema = new mongoose.Schema({
  notesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notes'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  price: {
    type: Number,
    required: true
  },
  gender: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('SalesNotes', SalesNotesSchema)
