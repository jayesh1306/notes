const express = require('express');
const db = require('../db/queries');
const router = express.Router();
const UserNotes = require('../models/UserNotes');
const Notes = require('../models/Notes');

router.get('/', (req, res, next) => {
    if (req.userData != null) {
        db.getUser(req.userData.email).then(users => {
            if (users.length <= 1) {
                if (users[0].gender == 1) {
                    UserNotes.find({ gender: 1 }).populate('notesId').then(datas => {
                        console.log(datas);
                        if (datas.length == 0) {
                            res.render('notes/notes', {
                                userData: req.userData,
                                notes: '',
                                userId: ''
                            })
                        } else {
                            res.render('notes/notes', {
                                userData: req.userData,
                                notes: datas[0].notesId,
                                userId: datas[0].userId
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else if (user[0].gender == 0) {
                    UserNotes.find({ gender: 0 }).populate('notesId').then(datas => {
                        // console.log(datas);
                        if (datas.length <= 1) {
                            res.render('notes/notes', {
                                userData: req.userData,
                                notes: '',
                                userId: ''
                            })
                        } else {
                            res.render('notes/notes', {
                                userData: req.userData,
                                notes: datas[0].notesId,
                                userId: datas[0].userId

                            })
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    res.render('notes/notes', {
                        userData: req.userData,
                        notes: '',
                        userId: ''
                    })
                }
            }
        }).catch();
    } else {
        UserNotes.find().populate('notesId').then(notes => {
            console.log(notes);

            if (notes == null) {
                res.render('notes/notes',
                    { userData: res.userData, notes: '', userId: '' })
            } else {
                res.render('notes/notes',
                    { userData: res.userData, notes: notes[0].notesId, userId: notes[0].userId })
            }
        }).catch(err => {
            req.flash('error', {
                userData: req.userData
            })
        });
    }
})

module.exports = router