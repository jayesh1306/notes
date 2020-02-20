const express = require('express')
const db = require('../db/queries')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index', {
    userData: req.userData
  })
})

module.exports = router
