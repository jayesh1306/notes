const User = require('../models/User')
const Note = require('../models/Notes')

exports.getAllUser = req => {
  return new Promise((resolve, reject) => {
    User.find({}, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

exports.getUser = username => {
  return new Promise((resolve, reject, email, contact) => {
    User.find(
      {
        $or: [{ email: username }, { contact: username }]
      },
      (err, user) => {
        if (err) {
          reject(err)
        } else {
          resolve(user)
        }
      }
    )
  })
}

exports.getAllNotes = () => {
  return new Promise((resolve, reject) => {
    Note.find((err, notes) => {
      if (err) {
        reject(err)
      } else {
        resolve(notes)
      }
    })
  })
}

exports.getNote = (id) => {
  return new Promise((resolve, reject) => {
    Note.findOne({ _id: id }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data);
      }
    })
  })
}

exports.updateUser = (user, data) => {
  return new Promise((resolve, reject) => {
    User.updateOne({ email: user }, { notesId: data }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}