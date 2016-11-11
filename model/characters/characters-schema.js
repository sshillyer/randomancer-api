/*******************************************************************************
Author:         Shawn Hillyer
Description:    CS 496, Oregon State University
*******************************************************************************/
"use strict";

const   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = mongoose.Schema.Types.ObjectId;


const Skill = require('../skills/skills-schema');

const charactersSchema = mongoose.Schema({
//    _id: Number,  // This is implied and inserted automatically by MongoDB
    firstName: String,
    lastName: String,
    gender: String,
    race: String,
    skills: [{ type: ObjectId, ref: 'Skills'}],
});

const Character = mongoose.model('Characters', charactersSchema);
module.exports = Character;



// Populate seed data if none exists
Character.find(function(err, characters) {
    if(characters.length) return;
   
    Character.create({
        firstName: "Groc",
        lastName: "Slamfist",
        gender: "Male",
        race: "Orc",
//        skills: ['Athletics', 'Intimidation', 'Survival']
    }, function(err, character) {
        if(err) console.log(err);
        else console.log(character);
    });
    
        Character.create({
        firstName: "Iluv",
        lastName: "Fyrespelz",
        gender: "Female",
        race: "Human",
//        skills: ['Arcana', 'Investigation', 'Medicine']
    }, function(err, character) {
        if(err) console.log(err);
        else console.log(character);
    });
    
});
