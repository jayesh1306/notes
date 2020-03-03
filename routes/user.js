const express = require('express')
const db = require('../db/queries')
const salesNotes = require('../models/SaleNotes')
const UserNotes = require('../models/UserNotes')
const nodemailer = require('nodemailer')
const Order = require('../models/Order')

let transporter = nodemailer.createTransport({
  service: 'gmail', // true for 465, false for other ports
  auth: {
    user: 'prajapatijayesh.beis.16@acharya.ac.in', // generated ethereal user
    pass: 'jscajyutkqmgymur' // generated ethereal password
  }
})

const router = express.Router()

router.get('/dashboard', (req, res, next) => {
  db.getUser(req.userData.email)
    .then(user => {
      db.getAllNotes()
        .then(notes => {
          salesNotes
            .find({ userId: req.userData.id })
            .populate('notesId')
            .populate('userId')
            .then(salesNotes => {
              Order.find({ userId: req.userData.id })
                .populate('notes')
                .then(orders => {
                  if (salesNotes) {
                    res.render('user/dashboard', {
                      userData: user[0],
                      notes: notes,
                      salesNotes: salesNotes,
                      orders
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
  const { notesId, date, time, address } = req.body
  if (!notesId || !date || !time || !address) {
    req.flash('error_msg', 'All fields are required')
    res.redirect(`/notes/${req.params.id}`)
  }
  salesNotes
    .aggregate([
      {
        $sort: { price: 1 }
      }
    ])
    .then(data => {
      salesNotes
        .findOne({ notesId: data[0].notesId })
        .populate('userId')
        .populate('notesId')
        .then(singleNote => {
          transporter
            .sendMail({
              from: req.userData.email,
              to: singleNote.userId.email,
              subject:
                'Request for your Notes of ' + singleNote.notesId.subject,
              // html: `Please verify your account using this link. This Link is valid for 3 minutes only.  <a href='http://localhost:3000/auth/verify/${token}'>Click</a>`
              html: `Hello ${singleNote.userId.name}, You got a client!!! This person wants your notes at given address and time. Click below link and approve for giving notes to them!!`
            })
            .then(response => {
              if (response.accepted) {
                var order = new Order({
                  orderId: Date().getTime(),
                  notes: notesId,
                  user: singleNote.userId
                })
                order
                  .save()
                  .then(() => {
                    req.flash(
                      'success_msg',
                      'Thankyou. Your Request has been sent and added to your orders page'
                    )
                    res.redirect('/user/dashboard')
                  })
                  .catch(errors => {
                    req.flash('error_msg', errors.message)
                    res.redirect('/user/dashboard')
                  })
              }
            })
            .catch(error => {
              req.flash('error_msg', error.message)
              res.redirect('/notes')
            })
        })
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/notes')
    })
})

router.get('/addNotes', (req, res, next) => {
  res.render('user/notes', {
    userData: req.userData
  })
})

router.post('/addNotes', (req, res, next) => {
  console.log(req.userData)
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
})

module.exports = router
