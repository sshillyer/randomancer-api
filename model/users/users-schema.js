/*******************************************************************************
Author:         Shawn Hillyer
Description:    CS 496, Oregon State University
*******************************************************************************/
"use strict";

const   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = mongoose.Schema.Types.ObjectId;
//        ObjId = mongoose.Types.ObjectId;

const usersSchema = mongoose.Schema({
//    _id: ObjectId,  // This is implied and inserted automatically by MongoDB
    username: String,
    password: String,
    secret: String,
    characters: [{type: ObjectId, ref: 'Characters'}],
});




const User = mongoose.model('Users', usersSchema);
module.exports = User;


// Populate seed data if none exists
User.find(function(err, users) {
    if(users.length) return;

    User.create({
        username: "user",
        password: "pass",
        secret: "sec1"
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });

});
