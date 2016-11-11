/*******************************************************************************
Author:         Shawn Hillyer
Description:    CS 496, Oregon State University
*******************************************************************************/
"use strict";

const   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = mongoose.Types.ObjectId;

var Character = require('./characters-schema');
var Skill = require('../skills/skills-schema');
var controller = require('./characters-controller');

const Router = require('express').Router;
const router = new Router();

/********************************************************
* Base /characters handling (and querystrings)
/*******************************************************/

// GET route: /characters and /characters?attribute=value&atrb2=val2 etc..
router.route('/').get((req, res, next) => {
    // Find the character, populate the reference, then send status
    Character.find(req.query)
    .populate('skills', 'skill')
    .then(doc => res.status(200).json(doc))
    .catch(err => next(err));
});


// POST route: /characters  (create new character)
router.route('/').post((req, res, next) => {
    if (req.params.length == 0 || req.params.length == undefined)
        controller.create(req, res, next);
    else {
        console.log("req.params.length: " + req.params.length);
        res.status(400).json({
            errorMessage: "POST request to /characters should not contain a query string. Send parameters in request body."
        });
    }
});

// PUT route: /characters
router.route('/').put((req, res, next) => {
    res.status(400).json({
        errorMessage: "Cannot PUT to /characters without valid id of character",
        correctiveAction: "Send PUT to /characters/{id} to update values"
    })
});


// DELETE route to handle a delete request to the base URL
router.route('/').delete((req, res, next) => {
        Character.remove({})
        .then(doc => {
            if (!doc) { return res.status(404).end(); }
            res.status(200).json({
                message : "All characters deleted"
            });
        })
        .catch(err => next(err));
});




/********************************************************
* /characters/{id} handling
/*******************************************************/

// GET route: /characters/1234
router.route('/:id').get((req, res, next) => {
    // Find characters with matching ID and return after populating references
    Character.findById(req.params.id)
    .populate('skills', 'skill')
    .then(doc => res.status(200).json(doc))
    .catch(err => next(err));
});


// POST route: /characters{id}
router.route('/:id').post((req, res, next) => {
    res.status(400).json({
        errorMessage: "Cannot POST to /characters/{id}, use PUT to update or DELETE to delete or GET to retreive",
    })
});


// PUT route: /characters/{id}
router.route('/:id').put((req, res, next) => {
    // Search criteria pulled from URL
    var conditions = { _id: req.params.id };
    
    // Update character then return updated character if it existed
    Character.update(conditions, req.body)
    .then(doc=> {
        if (!doc) {res.status(404).end(); }
        Character.findById(req.params.id)
        .populate('skills', 'skill')
        .then(doc => res.status(200).json(doc))
        .catch(err => next(err));
    });
});


// DELETE route: /characters/{id}
router.route('/:id').delete((req, res, next) => {
    // Find ID then delete it if exists
    Character.find({_id: req.params.id})
    .remove().exec()
    res.status(200).json({
        message: 'Character with id ' + req.params.id + ' deleted'
    })
});

module.exports = router;
