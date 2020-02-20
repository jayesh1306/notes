const User = require('../models/User')

module.exports = (req, res, next) => {
  try {
    User.find({
      $or: [{ email: req.userData.email }, { contact: req.userData.email }]
    })
      .then(users => {
        if (users[0].verified == true) {
          next()
        } else {
          req.flash('error_msg', 'Account Not Verified')
          res.redirect('/auth/login')
        }
      })
      .catch(err => {
        req.flash('error_msg', 'User Not Regsitered')
        res.redirect('/error')
      })
  } catch (error) {
    req.flash('error_msg', error)
    res.redirect('/error')
  }
  next()
}
