const express = require('express')
const db = require('../db/queries');
const router = express.Router()

router.get('/dashboard', (req, res, next) => {
  db.getUser(req.userData.email)
    .then(user => {
      console.log(user)
      res.render('user/dashboard', {
        userData: user
      })
    })
    .catch(err => {
      req.flash('error_msg', err.message)
      res.redirect('/error');
    })
})


module.exports = router