const express = require('express')
const db = require('../db/queries')

const router = express.Router()

router.get('/dashboard', (req, res, next) => {
  db.getUser(req.userData.email)
    .then(user => {
      console.log(user);
      db.getNote()
      res.render('user/dashboard', {
        userData: user
      })
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/error')
    })
})

router.get('/notes/:id', (req, res, next) => {
  db.getNote(req.params.id)
    .then(note => {
      res.render('notes/buyNotes', {
        note,
        userData: req.userData
      })
    })
    .catch(err => {
      res.render('error', {
        err
      })
    })
})

router.post('/notes/:id/buy', (req, res, next) => {
  var notesId = req.params.id
  db.getNote(notesId)
    .then(note => {
      db.updateUser(req.userData.email, notesId)
        .then(user => {
          req.flash('success_msg', 'Request Sent Successfully')
          res.redirect('/user/dashboard')
        })
        .catch(error => {
          res.json({ error })
        })
    })
    .catch(err => {
      res.json({ err })
    })
})

router.get('/addNotes', (req, res, next) => {
  res.render('user/notes', {
    userData: req.userData
  })
})

module.exports = router
