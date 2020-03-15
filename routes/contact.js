const express = require('express')
const emailService = require('../services/email')
const router = express.Router()
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service: 'gmail', // true for 465, false for other ports
  auth: {
    user: 'jayesh203.jp@gmail.com', // generated ethereal user
    pass: 'nqdbhfhiwxtumfhh' // generated ethereal password
  }
})

//Get Contact page
router.get('/', (req, res, next) => {
  res.render('contact/contact', {
    userData: req.userData,
    title: 'Contact Us'
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
                            <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                              <h3>Thankyou for contacting us. We will get back to you soon ❤️</h3>
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
              title: 'Contact Us'
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
