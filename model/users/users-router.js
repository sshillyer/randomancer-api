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

// GET route. /users (get all) or querystring (/users?username=Bob)
// Returns: JSON of all users
router.route('/').get((req, res, next) => {
    // See controller.js in root dir for logic
    controller.find(req, res, next);
});


// POST route: /users (Create new skill)
// Returns: JSON of new user
router.route('/').post((req, res, next) => {
    var userName = req.body.username;

    // TODO Hash the username and password together & store as the 'secret'

    User.findOne({ username: userName}, function(err, result) {
        // If userName not found, then we can create the new user
        if (!result) {
            controller.create(req, res, next);
        }
        // userName was found, send back error message            
        else
            res.status(400).json({
            errorMessage: 'Username not unique',
        });
    });
});


// PUT route: /users  (disallowed)
// Returns: 400, JSON Error message
router.route('/').put((req, res, next) => {
    res.status(400).json({
        errorMessage: 'Cannot PUT to /users without username',
        correctiveAction: "Send PUT to /users/{username} to update values"
    })
});

// DELETE route: /users 
// Returns: 400, JSON Error message
router.route('/').delete((req, res, next) => {
    res.status(400).json({
        errorMessage: 'Cannot DELETE to /users without valid id of skill',
        correctiveAction: "Send DELETE to /users/{id} to delete a skill"
    })
});



/********************************************************
* /users/{username} handling
/*******************************************************/

// GET route: /users/{id}
// Returns the user or 
router.route('/:username').get((req, res, next) => {
    req.query = {'username': req.params.username};
    controller.find(req, res, next);
});

// POST route: /users/{username}
router.route('/:username').post((req, res, next) => {
    res.status(400).json({
        errorMessage: "Cannot POST to /users/{username}, use PUT to update or DELETE to delete or GET to retreive",
    })
});


// PUT route: /users/{username}
router.route('/:username').put((req, res, next) => {
    var userName = req.params.username;

    // Lookup the user; if found, update the values in req.body
    User.findOne({ username: userName}, function(err, result) {
        // userName not found
        if (!result) {
            res.status(400).json({
                errorMessage: 'Username not found',
            });
        }
        // userName was found, update it
        else  {
            req.params.id = result._id;
            controller.update(req, res, next);
        }
    });
});

// DELETE route: /users/{username}
// TODO: Delete all characters created by this username
router.route('/:username').delete((req, res, next) => {
    var userName = req.params.username;
    console.log("Attempting to remove username: " + userName);

    // Lookup the user; if found, update the values in req.body
    User.findOne({ username: userName}, function(err, result) {
        // userName not found
        if (!result) {
            res.status(400).json({
                errorMessage: 'Username not found',
            });
        }

        // userName was found, delete its characters then delete it
        else  {
            // Delete the characters belong to this user
            console.log(orphanCharacters);

            var orphanCharacters = result.characters;
            for (var i = 0; i < orphanCharacters.length; i++){
                console.log("Trying to remove: " + orphanCharacters[i]);
                Character.find({_id: orphanCharacters[i]})
                    .remove().exec()
            }

            // Now delete it
            User.remove( {username: req.params.username})
                .then(doc => {
                    if(!doc) {
                        // No success
                        res.status(404).end();
                    }
                    else {
                        // 204: success and no body content
                        res.status(204).end();
                    }
                })
                .catch(err => next(err));
        }
    });

    
});


module.exports = router;
