const express = require('express')
const localStorage = require('localStorage')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email')
const smsService = require('../services/twilio')
const db = require('../db/queries')
const User = require('../models/User')
const Notes = require('../models/Notes')
const sha256 = require('sha256')

const router = express.Router()

router.get('/login', (req, res, next) => {
  res.render('authentication/login', {
    userData: req.userData
  })
})

router.post('/login', (req, res, next) => {
  var username = req.body.username
  var password = sha256(req.body.password)
  db.getUser(username)
    .then(user => {
      if (user.length < 1) {
        req.flash('error_msg', 'Account Not Registered  ..!!')
        res.redirect('/auth/register')
      } else if (password != user[0].password) {
        req.flash('error_msg', 'Incorrect Password')
        res.redirect('/auth/login')
      } else {
        const token = jwt.sign(
          {
            email: username,
            gender: user.gender,
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
  if (req.userData) {
    res.redirect('/user/dashboard')
  } else {
    res.render('authentication/register', {
      userData: req.userData
    })
  }
})

router.post('/register', (req, res, next) => {
  console.log(req.body.password1, sha256(req.body.password1))
  var pass = sha256(req.body.password1)

  db.getUser(req.body.email)
    .then(user => {
      if (user.length < 1) {
        const userData = new User({
          name: req.body.name,
          contact: req.body.contact,
          email: req.body.email,
          password: pass,
          gender: req.body.gender
        })
        //Email Service
        emailService
          .sendEmail(userData.email)
          .then(info => {
            userData
              .save()
              .then(user => {
                smsService
                  .sendSMS(req.body.contact)
                  .then(data => {
                    req.flash(
                      'success_msg',
                      'Account Registered, Please Verify Email and enter code here that we have sent to your mobile number'
                    )
                    localStorage.setItem('mobile', '+91' + req.body.contact)
                    res.redirect('/auth/mobileVerification')
                  })
                  .catch(error => {
                    console.log(error)
                    req.flash(
                      'error_msg',
                      'Cannot Send SMS..Please try again Logging In'
                    )
                    res.redirect('/auth/login')
                  })
              })
              .catch(err => {
                req.flash('error_msg', err.message)
                res.redirect('/error')
              })
          })
          .catch(err => {
            console.log(err)
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

router.get('/sendEmail', (req, res, next) => {
  res.render('authentication/email', {
    userData: req.userData
  })
})

router.post('/sendEmail', (req, res, next) => {
  //Email Service
  emailService
    .sendEmail(req.body.email)
    .then(info => {
      db.getUser(req.body.email)
        .then(user => {
          req.flash('success_msg', 'Sent Email, Please Verify Email')
          res.redirect('/auth/login')
        })
        .catch(err => {
          req.flash('error_msg', err.message)
          res.redirect('/error')
        })
    })
    .catch(err => {
      req.flash(
        'error_msg',
        'Something Went Wrong...Please try again in Sometime'
      )
      res.redirect('/auth/login')
    })
})

router.get('/logout', (req, res, next) => {
  localStorage.clear()
  req.flash('success_msg', 'Successfully Logged Out')
  res.redirect('/auth/login')
})

router.get('/mobile', (req, res, next) => {
  res.render('authentication/mobile', {
    userData: req.userData
  })
})

router.get('/mobileVerification', (req, res, next) => {
  if (localStorage.getItem('mobile') == null) {
    localStorage.setItem('mobile', '+91' + req.query.contact)
    smsService
      .sendSMS(req.query.contact)
      .then(datd => {
        res.render('authentication/mobileVerify', {
          userData: req.userData
        })
      })
      .catch(err => {
        req.flash('error_msg', err.message)
        res.redirect('/auth/mobile')
      })
  } else {
    res.render('authentication/mobileVerify', {
      userData: req.userData
    })
  }
})

router.post('/mobileVerification', (req, res, next) => {
  if (localStorage.getItem('mobile') && req.body.code.length === 6) {
    smsService
      .verifySms(req.body.code)
      .then(data => {
        console.log(data)
        if (data.status === 'approved') {
          var contact = localStorage.getItem('mobile')
          var mobile = contact.substring(3)
          User.updateOne({ contact: mobile }, { isMobileVerified: true })
            .then(data => {
              req.flash('success_msg', 'Mobile Number Verified')
              res.redirect('/auth/login')
            })
            .catch(error => {
              req.flash(
                'error_msg',
                'Phone Number or Code is Invalid....Please try again log in'
              )
              res.redirect('/auth/login')
            })
        }
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    req.flash(
      'error_msg',
      'Phone Number or Code is Invalid....Please try again log in'
    )
    res.redirect('/auth/login')
  }
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
            req.flash('success_msg', 'User Verified. Please log in ')
            res.redirect('/auth/login')
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

router.post('/sendSMS', (req, res, next) => {
  localStorage.setItem('mobile', '+91' + req.body.contact)
  smsService
    .sendSMS(req.body.contact)
    .then(data => {
      req.flash('success_msg', 'Successfully Sent Message')
      res.redirect('/auth/mobileVerification')
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/auth/mobile')
    })
})

router.get('/forgotPassword', (req, res, next) => {
  res.render('authentication/forgotPassword', {
    userData: req.userData
  })
})

router.post('/forgotPassword', (req, res, next) => {
  emailService
    .forgotPassword(req.body.email)
    .then(data => {
      req.flash(
        'success_msg',
        'Link is sent to your email.Please click link and change password'
      )
      res.redirect('/auth/forgotPassword')
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/auth/forgotPassword')
    })
})

router.get('/forgotPassword/:token', (req, res, next) => {
  var decoded = jwt.verify(
    localStorage.getItem('token').split(' ')[1],
    'secret'
  )
  console.log(decoded.exp, parseInt(Date.now() / 1000))
  if (decoded.exp < parseInt(Date.now() / 1000)) {
    req.flash('error_msg', 'Link is Expired. Please try Again')
    res.redirect('/auth/forgotPassword')
  } else {
    db.getUser(decoded.email)
      .then(users => {
        if (users.length < 1) {
          req.flash('error_msg', "User Doesn't Exists. Please register First")
          res.redirect('/auth/register')
        } else {
          res.render('authentication/changePassword', {
            userData: req.userData
          })
        }
      })
      .catch(error => {
        req.flash('error_msg', error.message)
        res.redirect('/auth/forgotPassword')
      })
  }
})

router.post('/changePassword', (req, res, next) => {
  var pass = sha256(req.body.password1)
  var email = jwt.verify(localStorage.getItem('token').split(' ')[1], 'secret')
    .email
  console.log(email)
  User.updateOne({ email: email }, { password: pass })
    .then(user => {
      console.log(user)
      req.flash('success_msg', 'Password Changed Successfully')
      res.redirect('/auth/login')
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/auth/forgotPassword')
    })
})

module.exports = router
