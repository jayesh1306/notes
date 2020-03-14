const express = require('express')
const emailService = require('../services/email')
const router = express.Router()
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service: 'gmail', // true for 465, false for other ports
  auth: {
    user: 'prajapatijayesh.beis.16@acharya.ac.in', // generated ethereal user
    pass: 'jscajyutkqmgymur' // generated ethereal password
  }
})

//Get Contact page
router.get('/', (req, res, next) => {
  res.render('contact/contact', {
    userData: req.userData,
    title :'Contact Us'
  })
})

//Send Contact Email
router.post('/', (req, res, next) => {
  const { email, contact, msg } = req.body
  emailService
    .sendEmail(null, req)
    .then(info => {
      transporter.sendMail(
        {
          from: `Notes Sharing App <no-reply@notesapp.com>`,
          to: req.body.email,
          subject: 'Thank You : ' + req.body.name,
          html: `Thankyou For Contacting us! We will get back to you soon`
        },
        (err, data) => {
          if (err) {
            console.log(err)
            req.flash('error_msg', err.message)
            res.redirect('/contact')
          } else {
            req.flash('success_msg', 'Successfully Sent')
            res.render('contact/contact', {
              userData: req.userData,
              title : 'Contact Us'
            })
          }
        }
      )
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', err.message)
      res.redirect('/contact')
    })
})

module.exports = router
