const express = require('express')
const localStorage = require('localStorage')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email')
const db = require('../db/queries')
const User = require('../models/User')
const Notes = require('../models/Notes')
const sha256 = require('sha256')

const router = express.Router()

router.get('/login', (req, res, next) => {
  if (req.userData) {
    res.redirect('/user/dashboard')
  } else {
    res.render('authentication/login', {
      userData: req.userData
    })
  }
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body
  db.getUser(username)
    .then(user => {
      if (user.length < 1) {
        req.flash('error_msg', 'No User found')
        res.redire('/auth/register')
      } else {
        const token = jwt.sign(
          {
            email: username,
            id: user._id
          },
          'secret',
          {
            expiresIn: '24h'
          }
        )
        localStorage.setItem('token', 'Bearer ' + token)
        res.redirect('/user/dashboard')
      }
    })
    .catch(err => {
      console.log(err)
      res.json({ error: err })
    })
})

router.get('/register', (req, res, next) => {
  res.render('authentication/register', {
    userData: req.userData
  })
})

router.post('/register', (req, res, next) => {
  var pass = sha256(req.body.password).toString()

  db.getUser(req.body.email)
    .then(user => {
      if (user.length < 1) {
        const userData = new User({
          name: req.body.name,
          contact: req.body.contact,
          email: req.body.email,
          password: pass
        })
        //Email Service
        emailService
          .sendEmail(userData.email)
          .then(info => {
            userData
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Account Registered, Please Verify Email'
                )
                res.redirect('/auth/register')
              })
              .catch(err => {
                req.flash('error_msg', err.message)
                res.redirect('/error')
              })
          })
          .catch(err => {
            req.flash(
              'error_msg',
              'Could not Send Email...Please try again in Sometime'
            )
            res.redirect('/auth/register')
          })
      } else {
        req.flash('error_msg', 'User Account Already Registered')
        res.redirect('/auth/login')
      }
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/logout', (req, res, next) => {
  localStorage.clear()
  req.flash('success_msg', 'Successfully Logged Out')
  res.redirect('/auth/login')
})

router.get('/verify/:token', (req, res, next) => {
  var token = localStorage.getItem('token')

  var decoded = jwt.decode(token.split(' ')[1], 'secret')
  console.log(decoded)
  if (decoded.exp < parseInt(Date.now() * 1000)) {
    db.getUser(decoded.email)
      .then(users => {
        User.updateOne({ email: decoded.email }, { verified: true })
          .then(user => {
            res.status(200).json({ success: 'User Verified' })
          })
          .catch(err => {
            res.status(401).json({ failed: err.message })
          })
      })
      .catch(err => {
        res.json({ error: err })
      })
  } else {
    res.json({ verification: 'failed' })
  }
})

router.post('/addNotes', (req, res, next) => {
  var notes = Notes({
    department: 'Computer Science',
    semester: 2,
    subject: 'Computer Networks'
  })
  notes.save()
})

module.exports = router
