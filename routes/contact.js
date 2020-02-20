const express = require('express')
const emailService = require('../services/email')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('contact/contact', {
    userData: req.userData
  })
})

router.post('/', (req, res, next) => {
  const { email, contact, msg } = req.body
  emailService
    .sendEmail(null, req)
    .then(info => {
      req.flash('success_msg', 'Sent Successfully')
      res.redirect('/contact')
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/contact')
    })
})

module.exports = router
