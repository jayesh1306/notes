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
  },
  status: {
    type: Number,
    default: 0 // 0 = Not bought, 1 = Pending, 2 = Approved, 3 = Delievered
  }
})

module.exports = mongoose.model('SalesNotes', SalesNotesSchema)
