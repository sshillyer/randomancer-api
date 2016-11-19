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


// Login route
router.route('/login').post((req, res, next) => {
    var userName = req.body.username;

    User.findOne({ username: userName}, function(err, result) {
        // If userName not found, then we can create the new user
        if (result) {
            console.log(result.password);
            console.log(req.body.password);
            var isPasswordMatch = (result.password == req.body.password);
            if (req.body.password == result.password) {
                res.status(202).json({
                    'authorized': 'true',
                });
            }
            else {
                res.status(401).json({
                    'authorized': 'false'
                });
            }
        }
        // userName was found, send back error message            
        else
            res.status(400).json({
            errorMessage: 'Username not found',
        });
    });
});



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
* /users/{username}/characters/{id} handling
/*******************************************************/

// GET route: /users/{username}/characters/{id}
// Returns JSON of all characters belonging to {username}
router.route('/:username/characters/:id').get((req, res, next) => {
    // Find characters with matching ID and return after populating references
    Character.findById(req.params.id)
    .populate('skills', 'skill')
    .then(doc => res.status(200).json(doc))
    .catch(err => next(err));
});


// POST route: /users/{username}/characters/{id}
router.route('/:username/characters/:id').post((req, res, next) => {
    res.status(400).json({
        errorMessage: "Cannot POST to /users/{username}/characters/{id}",
    })
});


// PUT route: /users/{username}/characters/{id}
router.route('/:username/characters/:id').put((req, res, next) => {
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


// DELETE route: /users/{username}/characters/{id}
router.route('/:username/characters/:id').delete((req, res, next) => {
    var userName = req.params.username;
    console.log("Attempting to delete character for username: " + userName);

    // Lookup the user; if found, update the values in req.body
    User.findOne({ username: userName}, function(err, user) {
        // userName not found
        if (!user) {
            res.status(400).json({
                errorMessage: 'Username not found',
            });
        }

        // userName was found, make the character
        else  {
            console.log("user.id: " + user.id);
            User.findByIdAndUpdate( 
                user.id,
                { $pull: {'characters': req.params.id}},
                {safe: true, upsert: true, new : true},
                function(err, model) {
                    if(err) console.log(err);
            });

            Character.find({_id: req.params.id})
            .remove().exec()
            res.status(200).json({
                message: 'Character with id ' + req.params.id + ' deleted'
            })
        }
    }); 
});

/********************************************************
* /users/{username} handling
/*******************************************************/

// GET route: /users/{username}
// Returns JSON of the user
router.route('/:username').get((req, res, next) => {
    req.query = {'username': req.params.username};
    controller.find(req, res, next);
});

// POST route: /users/{username}
router.route('/:username').post((req, res, next) => {
    res.status(400).json({
        errorMessage: "Cannot POST to /users/{username}",
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
            var orphanCharacters = result.characters;

            // Iterate through the characters and call .find().remove on the _id's
            for (var i = 0; i < orphanCharacters.length; i++){
                console.log("Trying to remove: " + orphanCharacters[i]);
                Character.find({_id: orphanCharacters[i]})
                    .remove().exec()
            }

            // Delete the username itself
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

/********************************************************
* /users/{username}/characters handling
/*******************************************************/

// GET route: /users/{username}/characters
// Returns JSON of all characters belonging to {username}
router.route('/:username/characters').get((req, res, next) => {
    var userName = req.params.username;
    console.log("Attempting to retrieve characters for username: " + userName);

    // Lookup the user; if found, retreive characters & send resp
    User.findOne({ username: userName}, function(err, result) {
        // userName not found
        if (!result) {
            res.status(400).json({
                errorMessage: 'Username not found',
            });
        }

        // userName was found, find its characters and send back as JSON
        else  {
            var characters = result.characters;
            console.log("*****Characters looks like this:");
            console.log(characters);

            // Find all Character documents where id in the array
            // Character.find({
            //     '_id': { $in: characters}
            // }, function(err, docs){
            //     console.log(docs);
            //     res.status(200).json(docs);

                Character.find({'_id': { $in: characters}})
                    .populate('skills', 'skill')
                    .then(doc => res.status(200).json(doc))
                    .catch(err => next(err));
        }
    }); 
});


// POST route: /users/{username}/characters
router.route('/:username/characters').post((req, res, next) => {
    var userName = req.params.username;
    console.log("Attempting to add new character for username: " + userName);

    // Lookup the user; if found, update the values in req.body
    User.findOne({ username: userName}, function(err, user) {
        // userName not found
        if (!user) {
            res.status(400).json({
                errorMessage: 'Username not found',
            });
        }

        // userName was found, make the character
        else  {
            Character.create(req.body, function(err, newChar) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    console.log("New character id " + newChar.id + ", user id " + user.id);
                    
                    // Find current character using their id and push the character to the arraylist
                    User.findByIdAndUpdate(
                        user.id, // user's id
                        {$push: {'characters': newChar.id}},
                        {safe: true, upsert: true, new : true},
                        function(err, model) {
                            if(err) console.log(err);
                        }); // End of User.findByIdAndUpdate

                    res.status(201).json(newChar);
                }
            }); // End of Character.create() call
        }
    }); 
});


// PUT route: /users/{username}/characters
router.route('/:username/characters').put((req, res, next) => {
    res.status(400).json({
        errorMessage: "Cannot PUT to /users/{username}/characters",
    })
});

// DELETE route: /users/{username}/characters
router.route('/:username/characters').delete((req, res, next) => {
    res.status(400).json({
        errorMessage: "Cannot DELETE to /users/{username}/characters",
    })
});

module.exports = router;
