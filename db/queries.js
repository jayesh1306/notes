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
  console.log(username)

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
