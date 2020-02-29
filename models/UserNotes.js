const mongoose = require('mongoose');

const UserNotesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    gender: {
        type: Number,
        required: true
    },
    notesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes'
    }]
})

module.exports = mongoose.model('UserNotes', UserNotesSchema);