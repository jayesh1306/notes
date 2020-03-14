const express = require('express')

//Middlewares
const verify = require('../middleware/verify')
const checkAuth = require('../middleware/checkAuth')
const Note = require('../models/Notes')

//Routes
const home = require('./homePage')
const auth = require('./auth')
const user = require('./user')
const contact = require('./contact')
const notes = require('./notes')
const router = express.Router()

//Error Route
router.get('/error', (req, res, next) => {
	res.render('error', {
		userData: req.userData,
		title : 'Error'
	})
})

router.post('/welcome', (req, res, next) => {
	console.log(req.body.file)
	res.json({ success: 'File Received' })
})

//About Section
router.use('/about', checkAuth, (req, res, next) => {
	res.render('about/about', {
		userData: req.userData,
		title : "About Us"
	})
})

//Contact Route
router.use('/contact', checkAuth, contact)

//Authentication Route
router.use('/auth', auth)

//User Routes
router.use('/user', checkAuth, verify, user)
router.use('/notes', checkAuth, notes)
router.use('/', checkAuth, home)

router.get('/addNotes', (req, res, next) => {
	res.render('addNotes', {
		userData: req.userData,
		title :"Add Notes"
	})
})

router.post('/addNotes', (req, res, next) => {
	var notes = new Note({
		department: req.body.department,
		semester: req.body.semester,
		subject: req.body.subject,
		year: req.body.year,
		scheme: req.body.scheme,
		code: req.body.code
	})
	notes
		.save()
		.then(notes => {
			req.flash('success_msg', 'Saved!!!')
			res.redirect('/addNotes')
		})
		.catch(err => {
			req.flash('error_msg', err.message)
			res.redirect('/addNotes')
		})
})

//Home Route
module.exports = router
