const express = require('express');
const db = require('../db/queries');
const router = express.Router();
const UserNotes = require('../models/UserNotes');
const Notes = require('../models/Notes');

router.get('/', (req, res, next) => {
    if (req.userData != null) {
        db.getUser(req.userData.email).then(users => {
            if (users[0].gender == 1) {
                UserNotes.find({ gender: 1 }).populate('notesId').then(datas => {
                    console.log(datas[0].notesId)
                    res.render('notes/notes', {
                        userData: req.userData,
                        notes: datas[0].notesId
                    })
                }).catch(err => {
                    console.log(err);
                });
            } else {
                UserNotes.find({ gender: 0 }).populate('notesId').then(datas => {
                    if (datas.length <= 1) {
                        res.render('notes/notes', {
                            userData: req.userData,
                            notes: ''
                        })
                    } else {
                        res.render('notes/notes', {
                            userData: req.userData,
                            notes: datas[0].notesId
                        })
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }).catch();
    } else {
        UserNotes.find().populate('notesId').then(notes => {
            res.render('notes/notes',
                { userData: res.userData, notes: notes[0].notesId })
        }).catch(err => {
            req.flash('error', {
                user: req.userData
            })
        });
    }
})

module.exports = router