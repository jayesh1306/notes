const express = require('express')
const db = require('../db/queries')
const router = express.Router()

//Get HomePage
router.get('/', (req, res, next) => {
	res.render('index', {
		userData: req.userData,
		title : 'Welcome'
	})
})

module.exports = router
