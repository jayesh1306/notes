const express = require('express')
const db = require('../db/queries')
const UserNotes = require('../models/UserNotes');

const router = express.Router()

router.get('/dashboard', (req, res, next) => {
  db.getUser(req.userData.email)
    .then(user => {
      db.getAllNotes().then(notes => {
        UserNotes.findOne({ userId: user[0]._id }).populate('notesId')
          .then(salesNotes => {
            if (salesNotes == null) {
              res.render('user/dashboard', {
                userData: user,
                notes: notes,
                salesNotes: '',
                prices: ''
              })
            } else {
              
            }
          })
          .catch(err => {
            req.flash('error_msg', err.message)
            res.redirect('/error')
          })
      }).catch(err => {
        req.flash('error_msg', err.message)
        res.redirect('/error')
      });
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
          res.render('error', {
            error
          })
        })
    })
    .catch(err => {
      res.render('error', {
        err
      })
    })
})

router.get('/addNotes', (req, res, next) => {
  res.render('user/notes', {
    userData: req.userData
  })
})

router.post('/addNotes', (req, res, next) => {
  console.log(req.userData)
  UserNotes.find({ userId: req.userData.id })
    .then(data => {
      console.log(data);
      if (data.length <= 0) {
        var newNote = new UserNotes({
          userId: req.userData.id,
          notesId: req.body.subject,
          gender: req.userData.gender,
          price: req.body.price
        });
        newNote
          .save()
          .then(() => {
            req.flash('success_msg', 'Successfully Created Sales Order');
            res.redirect('/user/dashboard');
          })
          .catch(err => {
            res.render('error', {
              err,
              userData: req.userData
            })
          });
      } else {
        UserNotes
          .updateOne(
            { userId: req.userData.id },
            { $push: { notesId: req.body.subject, price: req.body.price } })
          .then(data => {
            req.flash('success_msg', 'Successfully Added Notes');
            res.redirect('/user/dashboard');
          })
          .catch(err => {
            res.render('error', {
              err,
              userData: req.userData
            })
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.render('error', {
        err,
        userData: req.userData
      })
    })
})

module.exports = router
