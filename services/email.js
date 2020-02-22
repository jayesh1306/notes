const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const localStorage = require('localStorage')

let transporter = nodemailer.createTransport({
  service: 'gmail', // true for 465, false for other ports
  auth: {
    user: 'prajapatijayesh.beis.16@acharya.ac.in', // generated ethereal user
    pass: 'jscajyutkqmgymur' // generated ethereal password
  }
})

exports.sendEmail = (email, req) => {
  if (email) {
    const token = jwt.sign(
      {
        email: email
      },
      'secret',
      {
        expiresIn: 180
      }
    )
    localStorage.setItem('token', 'Bearer ' + token)
    return new Promise(async (resolve, reject) => {
      transporter.sendMail(
        {
          from: 'Jayesh Prajapati <jayesh203.jp@gmail.com>',
          to: email,
          subject: 'Verification Link',
          html: `Please verify your account using this link. This Link is valid for 3 minutes only.  <a href='https://notessapp.herokuapp.com//auth/verify/${token}'>Click</a>`
        },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        }
      )
    })
  } else {
    return new Promise(async (resolve, reject) => {
      transporter.sendMail(
        {
          from: req.body.email,
          to: `prajapatijayesh.beis.16@acharya.ac.in`,
          subject: 'Complaint from User : ' + req.body.name,
          html: req.body.msg
        },
        (err, data) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(data)
            resolve(data)
          }
        }
      )
    })
  }
}
