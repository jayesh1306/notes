const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.json({ user: req.userData })
})

router.post('/')

module.exports = router
