const User = require('../models/User')

module.exports = (req, res, next) => {
  if (!req.userData) {
    req.flash('error_msg', 'Not Logged In...Please log in to view the source')
    res.redirect('/auth/login')
  } else {
    User.findOne({
      $or: [{ email: req.userData.email }, { contact: req.userData.email }]
    })
      .then(users => {
        if (users.verified == false) {
          req.flash('error_msg', `Account Not Verified, Enter below email and verify. Link will be valid for 3 minutes only`)
          res.redirect('/auth/sendEmail');
        } else if (users.isMobileVerified == false) {
          req.flash('error_msg', 'Mobile Not Verified. Plese enter mobile number here to verify');
          res.redirect('/auth/mobile');
        } else {
          next()
        }
      })
      .catch(err => {
        req.flash('error_msg', 'User Not Regsitered')
        res.redirect('/error')
      })
  }
} 
