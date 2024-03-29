const express = require('express')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email')
const smsService = require('../services/twilio')
const db = require('../db/queries')
const User = require('../models/User')
const Notes = require('../models/Notes')
const sha256 = require('sha256')
const nodemailer = require('nodemailer')
const checkAuth = require('../middleware/checkAuth')
const verify = require('../middleware/verify')

const router = express.Router()

//Email instance
let transporter = nodemailer.createTransport({
  service: 'gmail', // true for 465, false for other ports
  auth: {
    user: 'jayesh203.jp@gmail.com', // generated ethereal user
    pass: 'nqdbhfhiwxtumfhh' // generated ethereal password
  }
})

//Get Login Page
router.get('/login', (req, res, next) => {
  res.render('authentication/login', {
    userData: req.userData,
    title: 'Login'
  })
})

//Post Login
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
            gender: user[0].gender,
            id: user[0]._id
          },
          'secret',
          {
            expiresIn: '24h'
          }
        )
        User.updateOne({ _id: user[0]._id }, { lastLogin: Date.now() }).then(user => {
          res.cookie('token', 'Bearer ' + token)
          res.redirect('/user/dashboard')
        }).catch(err => {
          console.log(err);
          req.flash('error_msg', err.message);
          res.redirect('/auth/login');
        });
      }
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', err.message)
      res.redirect('/error')
    })
})

//Get Register Page
router.get('/register', (req, res, next) => {
  res.render('authentication/register', {
    userData: req.userData,
    title: 'Register'
  })
})

//Post Register
router.post('/register', (req, res, next) => {
  var pass = sha256(req.body.password1)

  User.find({
    $or: [{ email: req.body.email }, { contact: req.body.contact }]
  })
    .then(user => {
      console.log(user)
      if (user.length < 1) {
        const userData = new User({
          name: req.body.name,
          contact: req.body.contact,
          email: req.body.email,
          password: pass,
          gender: req.body.gender,
          profile: 'https://ui-avatars.com/api/?name=' + req.body.name
        })
        const token = jwt.sign(
          {
            email: req.body.email
          },
          'secret',
          {
            expiresIn: 180
          }
        )
        //Email Service
        transporter
          .sendMail({
            from: 'Notes Sharing App <no-reply@notesapp.com>',
            to: req.body.email,
            subject: 'Verification Link',
            // html: `Please verify your account using this link. This Link is valid for 3 minutes only.  <a href='http://localhost:3000/auth/verify/${token}'>Click</a>`
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Demystifying Email Design</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </head>
            <body style="margin: 0; padding: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%"> 
                <tr>
                  <td style="padding: 10px 0 30px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                      <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                          <img src="https://cdn.iconscout.com/icon/free/png-256/pied-piper-11-599410.png" alt="Creating Email Magic" width="300" height="230" style="display: block;" />
										<h3>Notes Sharing Application</h3>

                        </td>
                      </tr>
                      <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                <b>Account Verification Link</b>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                              Please verify your account using this link. This Link is valid for 3 minutes only.  <a href='https://notessapp.herokuapp.com/auth/verify/${token}'>Click</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                &reg; Copyright @ Notes Sharing Application 2020. Made with ❤️<br/>
                              </td>
                              <td align="right" width="25%">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                      <a href="http://www.twitter.com/" style="color: #ffffff;">
                                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/tw.gif" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
                                      </a>
                                    </td>
                                    <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                    <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                      <a href="http://www.twitter.com/" style="color: #ffffff;">
                                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/fb.gif" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>`
          })
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
                    res.cookie('token', 'Bearer ' + token)
                    res.cookie('mobile', '+91' + user.contact)
                    res.render('authentication/mobileVerify', {
                      userData: req.userData,
                      title: 'Mobile Verification'
                    })
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
                console.log(err)
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
      req.flash('error_msg', err.message)
      res.redirect('/error')
    })
})

//Send email if note verified
router.get('/sendEmail', (req, res, next) => {
  res.render('authentication/email', {
    userData: req.userData,
    title: "Email Verification"
  })
})

//Post Send Email
router.post('/sendEmail', (req, res, next) => {
  //Email Service
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        req.flash('error_msg', "Email Doesn't Exist")
        res.redirect('/auth/login')
      } else {
        emailService
          .sendEmail(req.body.email, null, res)
          .then(info => {
            db.getUser(req.body.email)
              .then(user => {
                console.log(req.cookies)
                req.flash('success_msg', 'Sent Email, Please Verify Email')
                res
                  .cookie('token', 'Bearer ' + info.token)
                  .redirect('/auth/login')
              })
              .catch(err => {
                console.log(err)
                req.flash('error_msg', err.message)
                res.redirect('/error')
              })
          })
          .catch(err => {
            console.log(err)
            req.flash(
              'error_msg',
              'Something Went Wrong...Please try again in Sometime'
            )
            console.log(err)
            res.redirect('/auth/login')
          })
      }
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', err.message)
      res.redirect('/auth/sendEmail')
    })
})

//Mobile Verification if not verified
router.get('/mobile', (req, res, next) => {
  res.render('authentication/mobile', {
    userData: req.userData,
    title: 'Mobile Verification'
  })
})

//Entering code for mobile verification
router.get('/mobileVerification', (req, res, next) => {
  smsService
    .sendSMS(req.query.contact)
    .then(data => {
      res
        .cookie('mobile', '+91' + req.query.contact)
        .render('authentication/mobileVerify', {
          userData: req.userData,
          title: 'Mobile Verification'
        })
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', err.message)
      res.redirect('/auth/mobile')
    })
})

//Process Mobile verification using twilio
router.post('/mobileVerification', (req, res, next) => {
  console.log(req.cookies, req.body)
  if (req.cookies.mobile && req.body.code.length === 6) {
    smsService
      .verifySms(req.body.code, req.cookies.mobile)
      .then(data => {
        if (data.status === 'approved') {
          var contact = req.cookies.mobile
          var mobile = contact.substring(3)
          User.updateOne({ contact: mobile }, { isMobileVerified: true })
            .then(data => {
              req.flash('success_msg', 'Mobile Number Verified')
              res.redirect('/auth/login')
            })
            .catch(error => {
              console.log(err)
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
        req.flash('error_msg', err.message)
        res.redirect('/auth/mobileVerification')
      })
  } else {
    req.flash(
      'error_msg',
      'Phone Number or Code is Invalid....Please try again log in'
    )
    res.redirect('/auth/mobileVerification')
  }
})

//Verify email from email sent
router.get('/verify/:token', (req, res, next) => {
  console.log(req.params.token)
  var token = req.params.token
  var decoded = jwt.decode(token, 'secret')
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
            console.log(err)
            req.flash('error_msg', err.message)
            res.redirect('/auth/login')
          })
      })
      .catch(err => {
        console.log(err)
        req.flash('error_msg', err.message)
        res.redirect('/auth/login')
      })
  } else {
    req.flash('error_msg', 'Verification Failed')
    res.redirect('/auth/login')
  }
})

// Post Sending SMS
router.post('/sendSMS', (req, res, next) => {
  smsService
    .sendSMS(req.body.contact)
    .then(data => {
      req.flash('success_msg', 'Successfully Sent Message')
      res
        .cookie('mobile', '+91' + req.body.contact)
        .redirect('/auth/mobileVerification')
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', err.message)
      res.redirect('/auth/mobile')
    })
})

//Get frogot password Page
router.get('/forgotPassword', (req, res, next) => {
  res.render('authentication/forgotPassword', {
    userData: req.userData,
    title: 'Forgot Password'
  })
})

//Post request Forgot password
router.post('/forgotPassword', (req, res, next) => {
  emailService
    .forgotPassword(req.body.email, res)
    .then(data => {
      req.flash(
        'success_msg',
        'Link is sent to your email.Please click link and change password'
      )
      res.redirect('/auth/forgotPassword')
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', err.message)
      res.redirect('/auth/forgotPassword')
    })
})

//Verify email to change password
router.get('/forgotPassword/:token', (req, res, next) => {
  var decoded = jwt.verify(
    req.cookies.token.split(' ')[1],
    'secret'
  )
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
            userData: req.userData,
            title: 'Change Passsword'
          })
        }
      })
      .catch(error => {
        console.log(err)
        req.flash('error_msg', error.message)
        res.redirect('/auth/forgotPassword')
      })
  }
})

//Change Password
router.post('/changePassword', (req, res, next) => {
  var pass = sha256(req.body.password1)
  var email = jwt.verify(req.cookies.token.split(' ')[1], 'secret')
    .email
  console.log(email)
  User.updateOne({ email: email }, { password: pass })
    .then(user => {
      console.log(user)
      req.flash('success_msg', 'Password Changed Successfully')
      res.redirect('/auth/login')
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', err.message)
      res.redirect('/auth/forgotPassword')
    })
})

module.exports = router
