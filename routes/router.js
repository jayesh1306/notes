const express = require('express')

//Middlewares
const verify = require('../middleware/verify')
const checkAuth = require('../middleware/checkAuth')

//Routes
const home = require('./homePage')
const auth = require('./auth')
const user = require('./user')
const contact = require('./contact')
const router = express.Router()

//Error Route
router.get('/error', (req, res, next) => {
  res.render('error', {
    userData: req.userData
  })
})

//About Section
router.use('/about', checkAuth, (req, res, next) => {
  res.render('about/about', {
    userData: req.userData
  })
})

//Contact Route
router.use('/contact', contact)

//Authentication Route
router.use('/auth', checkAuth, auth)

//User Routes
router.use('/user', checkAuth, verify, user)
router.use('/', checkAuth, home)

//Home Route
module.exports = router
