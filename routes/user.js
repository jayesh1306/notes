const express = require('express')
const db = require('../db/queries')
const salesNotes = require('../models/SaleNotes')
const UserNotes = require('../models/UserNotes')

const router = express.Router()

router.get('/dashboard', (req, res, next) => {
  console.log(req.userData)
  db.getUser(req.userData.email)
    .then(user => {
      db.getAllNotes()
        .then(notes => {
          salesNotes
            .find({ userId: req.userData.id })
            .populate('notesId')
            .populate('userId')
            .then(salesNotes => {
              if (salesNotes) {
                console.log(salesNotes)
                console.log('------------')
                res.render('user/dashboard', {
                  userData: user[0],
                  notes: notes,
                  salesNotes: salesNotes
                })
              } else {
                console.log(salesNotes)
                res.render('user/dashboard', {
                  userData: user,
                  notes: notes,
                  salesNotes: null
                })
              }
            })
            .catch(err => {
              req.flash('error_msg', err.message)
              res.redirect('/error')
            })
        })
        .catch(err => {
          req.flash('error_msg', err.message)
          res.redirect('/error')
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
  console.log(req.userData);
  var newNote = new salesNotes({
    notesId: req.body.subject,
    userId: req.userData.id,
    price: req.body.price,
    gender: req.userData.gender
  })
  salesNotes
    .findOne({
      $and: [{ userId: req.userData.id }, { notesId: req.body.subject }]
    })
    .then(note => {
      if (note == null) {
        newNote
          .save()
          .then(() => {
            req.flash('success_msg', 'Successfully Saved Sales Order')
            res.redirect('/user/dashboard')
          })
          .catch(error => {
			  console.log(error)
            req.flash('error_msg', 'Cannot Save Because ' + error.message)
            res.redirect('/user/dashboard')
          })
      } else {
        req.flash(
          'error_msg',
          'You cannot post same subject notes more than once'
        )
        res.redirect('/user/dashboard')
      }
    })
    .catch(err => {
      req.flash('error_msg', 'Something went wrong')
      res.redirect('/user/dashboard')
    })
  //   UserNotes.find({ userId: req.userData.id })
  //     .then(data => {
  //       if (data.length <= 0) {
  //         var newNote = new UserNotes({
  //           userId: req.userData.id,
  //           gender: req.userData.gender,
  //           notes: {
  //             notesId: req.body.subject,
  //             price: req.body.price
  //           }
  //         })
  //         console.log(newNote)
  //         newNote
  //           .save()
  //           .then(() => {
  //             req.flash('success_msg', 'Successfully Created Sales Order')
  //             console.log('------------------------------')
  //             res.redirect('/user/dashboard')
  //           })
  //           .catch(err => {
  //             console.log(err)
  //             res.render('error', {
  //               err,
  //               userData: req.userData
  //             })
  //           })
  //       } else {
  //         var newNotes = { notesId: req.body.subject, price: req.body.price }
  //         UserNotes.updateOne(
  //           { userId: req.userData.id },
  //           { $push: { notes: newNotes } }
  //         )
  //           .then(data => {
  //             req.flash('success_msg', 'Successfully Added Notes')
  //             res.redirect('/user/dashboard')
  //           })
  //           .catch(err => {
  //             res.render('error', {
  //               err,
  //               userData: req.userData
  //             })
  //           })
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       res.render('error', {
  //         err,
  //         userData: req.userData
  //       })
  //     })
})

module.exports = router
