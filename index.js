/*******************************************************************************
Author:         Shawn Hillyer
Description:    CS 496, Oregon State University
*******************************************************************************/
"use strict"

/*******************************************************************************
 * Middleware Setup
 ******************************************************************************/

// Middleware
const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;


// Use submodule for routes
const routes = require('./routes');


// Import body-parser / setup (middleware for parsing POST content)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/********************************************************************************
 * Mongoose Setup
 ******************************************************************************/

// Import credentials (passwords etc.)
// Note: Always make sure to add database-level user (not just an Mlab.com user, for example)
const credentials = require('./credentials.js');


// Require in the mongoose modules, set connection string
const url = credentials.mongo.development.connectionString;


// Keeps the server alive when an error occurs
const opts = {
    server: {
        socketOptions: { keepAlive: 1 } // prevent database errors (good for a web-based API/website)
    }
};



// Connect to MongoLab database and start server up
// Reference: https://zellwk.com/blog/crud-express-mongodb/
// The db const is set here s owe have global access to it
var db;

// Connect to MongoDB and listen on port; if error, log and exit
mongoose.connect(credentials.mongo.development.connectionString, function(err, database) {
    if (err) return console.log(err);
    
    db = database;  // Assign the connection to the db variable
    
    const port = 8090;
    
    app.listen(port, function() {
        console.log('listening on ' + port)
    });
});


// Make our db accessible to our router by setting this as first in chain
app.use(function(req,res,next){
    req.db = db;
    next();
});


// Next set routes -- see routes.js file
app.use('/', routes);