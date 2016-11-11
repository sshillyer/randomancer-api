/*******************************************************************************
Author:         Shawn Hillyer
Description:    CS 496, Oregon State University
*******************************************************************************/
"use strict";

var path = require('path');
var User = require(path.resolve(__dirname, './users-schema') );
var Character = require('../characters/characters-schema');
var charController = require('../characters/characters-controller');
var controller = require('./users-controller');

const Router = require('express').Router;
const router = new Router();


/********************************************************
* Base /users handling (and querystrings)
/*******************************************************/

// GET route. /users (get all) or querystring (/users?skill=Arcana)
router.route('/').get((req, res, next) => {
    // See controller.js in root dir for logic
    controller.find(req, res, next);
});


// POST route: /users (Create new skill)
// Returns the skill built and its id as JSON
router.route('/').post((req, res, next) => {
    controller.create(req, res, next);
});


// PUT route: /users  (disallowed)
router.route('/').put((req, res, next) => {
    res.status(400).json({
        errorMessage: 'Cannot PUT to /users without valid id of skill',
        correctiveAction: "Send PUT to /users/{id} to update values"
    })
});

// DELETE route: /users Error message / status 400
router.route('/').delete((req, res, next) => {
    res.status(400).json({
        errorMessage: 'Cannot DELETE to /users without valid id of skill',
        correctiveAction: "Send DELETE to /users/{id} to delete a skill"
    })
});



/********************************************************
* /users/{id} handling
/*******************************************************/

// GET route: /users/{id}
router.route('/:id').get((req, res, next) => {
    controller.findById(req, res, next);
});

// POST route: /users/{id}
router.route('/:id').post((req, res, next) => {
    res.status(400).json({
        errorMessage: "Cannot POST to /users/{id}, use PUT to update or DELETE to delete or GET to retreive",
    })
});


// PUT route: /users/{id}
router.route('/:id').put((req, res, next) => {
    controller.update(req, res, next);
});

// DELETE route: /users/{id}
// Also delete references in character documents to this skil....
router.route('/:id').delete((req, res, next) => {
    var skillId = req.params.id;
    
    User.find({_id: skillId})
    .remove().exec()
    
    Character.update(
        { users: skillId },
        { $pull: { 'users' : {users : {$in: [skillId] } } } });
    
//    Character.update( {users: skillId}, {$pullAll: { users: [skillId] } } );
    
    res.status(200).json({
        message: 'User with id ' + skillId + ' deleted'
    });
});


module.exports = router;
