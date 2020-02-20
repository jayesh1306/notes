const express = require('express')
const db = require('../db/queries')
const router = express.Router()

router.get('/', (req, res, next) => {
  db.getAllNotes()
    .then(notes => {
      res.render('index', {
        notes,
        userData: req.userData
      })
    })
    .catch(err => {
      console.log(err)
      res.json({ err })
    })
})

module.exports = router
