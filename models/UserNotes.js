const mongoose = require('mongoose')

const UserNotesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  gender: {
    type: Number,
    required: true
  },
  notes: [
    {
      notesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes'
      },
      price: {
        type: Number,
        required: true
      }
    }
  ]
})

module.exports = mongoose.model('UserNotes', UserNotesSchema)
