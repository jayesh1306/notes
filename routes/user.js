const express = require('express')
const db = require('../db/queries')
const salesNotes = require('../models/SaleNotes')
const nodemailer = require('nodemailer')
const User = require('../models/User')
const Order = require('../models/Order')

let transporter = nodemailer.createTransport({
  service: 'gmail', // true for 465, false for other ports
  auth: {
    user: 'prajapatijayesh.beis.16@acharya.ac.in', // generated ethereal user
    pass: 'jscajyutkqmgymur' // generated ethereal password
  }
})

const router = express.Router()

router.get('/profile', (req, res, next) => {
  db.getUser(req.userData.email)
    .then(user => {
      console.log(user)
      res.render('user/profile', {
        userData: user[0]
      })
    })
    .catch()
})

//User Dashboard, Adding Sales NOtes, View Order Notes and Status of ordered NOtes.
router.get('/dashboard', (req, res, next) => {
  db.getUser(req.userData.email)
    .then(user => {
      console.log(user)
      res.render('user/profile', {
        userData: user[0]
      })
    })
    .catch(err => {
      req.flash(
        'error_msg',
        'Something went Wrong. Please try again in sometime'
      )
      res.redirect('/auth/login')
    })
})

router.get('/addNotes', (req, res, next) => {
  db.getAllNotes()
    .then(notes => {
      res.render('user/addNotes', {
        userData: req.userData,
        notes
      })
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/user/addNotes')
    })
})

router.get('/sales', (req, res, next) => {
  salesNotes
    .find({ userId: req.userData.id })
    .populate('notesId')
    .populate('notesId')
    .then(sales => {
      res.render('user/sales', {
        userData: req.userData,
        sales
      })
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/user/sales')
    })
})

//Single notes display to buy
router.get('/notes/:id', (req, res, next) => {
  salesNotes
    .find({ notesId: req.params.id })
    .populate('notesId')
    .populate('userId')
    .then(note => {
      res.render('notes/buyNotes', {
        note: note[0].notesId,
        price: note[0].price,
        userData: req.userData
      })
    })
    .catch(err => {
      res.render('error', {
        err
      })
    })
})

//Request for taking notes
router.post('/notes/:id/buy', (req, res, next) => {
  var { notesId, date, time, address } = req.body
  var d = new Date(date)
  d = d.toString().slice(0, 10)
  if (!notesId && !date && !time && !address) {
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
        .find({ notesId: data[0].notesId })
        .sort({ price: 1 })
        .populate('userId')
        .populate('notesId')
        .then(singleNote => {
          User.findOne({ _id: req.userData.id })
            .then(async user => {
              console.log(d)
              var result = await transporter.sendMail({
                from: req.userData.email,
                to: singleNote[0].userId.email,
                subject:
                  'Request for your Notes of ' + singleNote[0].notesId.subject,
                // html: `Please verify your account using this link. This Link is valid for 3 minutes only.  <a href='http://localhost:3000/auth/verify/${token}'>Click</a>`
                html: `<h3>Hello ${singleNote[0].userId.name}</h3><br>Name: ${user.name}<br>Email: ${user.email}<br>Contact: ${user.contact}<br>Address: ${address}<br>Time: ${time}<br>Date: ${d}`
              })
              if (result.rejected.length > 0) {
                req.flash('error_msg', 'Cannot Request for email')
                res.redirect(`/notes/${req.params.id}`)
              } else {
                var date = new Date()
                var orderId = date.getTime()
                var order = new Order({
                  orderId: orderId,
                  notes: notesId,
                  price: singleNote[0].price,
                  buyer: req.userData.id,
                  status: 1
                })
                order
                  .save()
                  .then(() => {
                    salesNotes
                      .updateOne(
                        { notesId: singleNote[0].notesId._id },
                        { status: 1 }
                      )
                      .then(data => {
                        req.flash(
                          'success_msg',
                          'Thankyou. Your Request has been sent and added to your orders page'
                        )
                        res.redirect('/user/dashboard')
                      })
                      .catch(err => {
                        req.flash('error_msg', errors.message)
                        res.redirect(`/notes/${req.params.id}`)
                      })
                  })
                  .catch(errors => {
                    req.flash('error_msg', errors.message)
                    res.redirect(`/notes/${req.params.id}`)
                  })
              }
            })
            .catch(err => {
              res.json({ err: err.message })
            })
        })
        .catch(err => {
          res.json({ err: err.message })
        })
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/notes')
    })
})

//Add Sales Notes
router.get('/addNotes', (req, res, next) => {
  res.render('user/notes', {
    userData: req.userData
  })
})

//Post method to Add Sales NOtes
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
            res.redirect('/user/addNotes')
          })
          .catch(error => {
            console.log(error)
            req.flash('error_msg', 'Cannot Save Because ' + error.message)
            res.redirect('/user/addNotes')
          })
      } else {
        req.flash(
          'error_msg',
          'You cannot post same subject notes more than once'
        )
        res.redirect('/user/addNotes')
      }
    })
    .catch(err => {
      req.flash('error_msg', 'Something went wrong')
      res.redirect('/user/addNotes')
    })
})

module.exports = router
