const express = require('express')
const db = require('../db/queries')
const router = express.Router()
const User = require('../models/User')
const salesNotes = require('../models/SaleNotes')
const Notes = require('../models/Notes')

//Get Notes Page
router.get('/', (req, res, next) => {
  if (req.userData != null) {
    salesNotes
      .find({
        $and: [
          { userId: { $ne: req.userData.id } },
          { gender: req.userData.gender },
          { status: 0 }
        ]
      })
      .populate('notesId')
      .populate('userId')
      .then(notes => {
        console.log(notes)
        if (notes.length < 1) {
          res.render('notes/notes', {
            userData: req.userData,
            notes: null,
            title: 'All Notes to Buy'
          })
        } else {
          res.render('notes/notes', {
            userData: req.userData,
            notes,
            title: 'All Notes to Buy'
          })
        }
      })
      .catch(err => {
        console.log(err)
        req.flash('error_msg', err.message);
        res.redirect('/error')
      })
  } else {
    salesNotes
      .find({ status: 0 })
      .populate('notesId')
      .populate('userId')
      .then(notes => {
        console.log(notes)
        if (notes.length == 0) {
          res.render('notes/notes', {
            userData: res.userData,
            notes: '',
            title: 'All Notes to Buy'
          })
        } else {
          res.render('notes/notes', {
            userData: res.userData,
            notes,
            title: 'All Notes to Buy'

          })
        }
      })
      .catch(err => {
        console.log(err);
        req.flash('error_msg', err.message);
        res.redirect('/error')
      })
  }
  // if (req.userData != null) {
  // 	db.getUser(req.userData.email)
  // 		.then(users => {
  // 			if (users.length <= 1) {
  // 				if (users[0].gender == 1) {
  // 					salesNotes.find({
  // 						$and: [{ gender: 1 }, { userId: { $ne: req.userData.id } }]
  // 					})
  // 						.populate('notesId')
  // 						.then(datas => {
  // 							console.log(datas[0].notes);
  // 							console.log(datas, req.userData)
  // 							if (datas.length == 0) {
  // 								res.render('notes/notes', {
  // 									userData: req.userData,
  // 									notes: '',
  // 								})
  // 							} else {
  // 								res.render('notes/notes', {
  // 									userData: req.userData,
  // 									notes: datas[0].notes,
  // 								})
  // 							}
  // 						})
  // 						.catch(err => {
  // 							console.log(err)
  // 						})
  // 				} else if (users[0].gender == 0) {
  // 					UserNotes.find({
  // 						$and: [{ gender: 0 }, { userId: { $ne: req.userData.id } }]
  // 					})
  // 						.populate('notesId')
  // 						.then(datas => {
  // 							console.log(datas[0].notes)
  // 							if (datas.length <= 1) {
  // 								res.render('notes/notes', {
  // 									userData: req.userData,
  // 									notes: '',
  // 								})
  // 							} else {
  // 								res.render('notes/notes', {
  // 									userData: req.userData,
  // 									notes: datas[0].notes,
  // 								})
  // 							}
  // 						})
  // 						.catch(err => {
  // 							console.log(err)
  // 						})
  // 				} else {
  // 					UserNotes.find()
  // 						.populate('notesId')
  // 						.then(notes => {
  // 							console.log(notes[0].notes)
  // 							if (notes != null) {
  // 								res.render('notes/notes', {
  // 									userData: req.userData,
  // 									notes: notes[0].notes,
  // 								})
  // 							} else {
  // 								res.render('notes/notes', {
  // 									userData: req.userData,
  // 									notes: '',
  // 								})
  // 							}
  // 						})
  // 						.catch(err => {
  // 							res.redirect('/error', {
  // 								err
  // 							})
  // 						})
  // 				}
  // 			}
  // 		})
  // 		.catch()
  // } else {
  // 	UserNotes.find()
  // 		.populate('notesId')
  // 		.then(notes => {
  // 			console.log(notes)
  // 			if (notes.length == 0) {
  // 				res.render('notes/notes', {
  // 					userData: res.userData,
  // 					notes: '',
  // 				})
  // 			} else {
  // 				res.render('notes/notes', {
  // 					userData: res.userData,
  // 					notes: notes[0].notes,
  // 				})
  // 			}
  // 		})
  // 		.catch(err => {
  // 			req.flash('error', {
  // 				userData: req.userData
  // 			})
  // 		})
  // }
})

module.exports = router
