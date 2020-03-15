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
const db = require('../db/queries')

//Error Route
router.get('/error', (req, res, next) => {
	res.render('error', {
		userData: req.userData,
		title: 'Error'
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
		title: "About Us"
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
		title: "Add Notes"
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

router.get('/admin', (req, res, next) => {
	res.render('admin', {
		userData: req.userData
	})
})

router.post('/admin', (req, res, next) => {
	if (req.body.password == 'admin12345') {
		res.redirect('/admin/dashboard');
	} else {
		res.redirect('/admin')
	}
})

router.get('/admin/dashboard', (req, res, next) => {
	db.getAllUser().then(user => {
		var totalUser = user.length;
		var activeUser = 0;
		var blockedUser = 0;
		for (var i = 0; i < user.length; i++) {
			if (user[i].isBlocked == 1) {
				blockedUser++;
			}
			var date = new Date(user[i].lastLogin);
			d = date.getDate();
			var todaysDate = new Date(Date.now());
			var td = todaysDate.getDate();
			console.log(td, date)
			if ((td - d) <= 7) {
				activeUser++
			}
		}
		console.log(activeUser)
		res.render('adminDashboard', {
			userData: req.userData,
			totalUser,
			activeUser,
			blockedUser
		})
	}).catch(err => {
		console.log(err);
		req.flash('error_msg', err.message);
		res.redirect('/error')
	});
})

router.get('/getAllUser', (req, res, next) => {
	db.getAllUser().then(user => {

		var totalUser = user.length
		res.status(200).json(totalUser)
	}).catch(err => {
		res.status(404).json(err)
	});
})

//Home Route
module.exports = router
