/*******************************************************************************
Author:         Shawn Hillyer
Description:    CS 496, Oregon State University
*******************************************************************************/
"use strict";

const   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = mongoose.Schema.Types.ObjectId;
//        ObjId = mongoose.Types.ObjectId;

const skillsSchema = mongoose.Schema({
//    _id: ObjectId,  // This is implied and inserted automatically by MongoDB
    skill: String,
    attribute: String,
});




const Skill = mongoose.model('Skills', skillsSchema);
module.exports = Skill;


// Populate seed data if none exists
Skill.find(function(err, skills) {
    if(skills.length) return;

    Skill.create({
//        _id: ObjId("Athletics"),
//        _id: 1,
        skill: "Athletics",
        attribute: "Strength",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });

    Skill.create({
//        _id: "Acrobatics",
//        _id: 1,
        skill: "Acrobatics",
        attribute: "Dexterity",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Animal Handling",
//        _id: 1,
        skill: "Animal Handling",
        attribute: "Wisdom",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Arcana",
//        _id: 1,
        skill: "Arcana",
        attribute: "Intelligence",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Deception",
//        _id: 1,
        skill: "Deception",
        attribute: "Charisma",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "History",
//        _id: 1,
        skill: "History",
        attribute: "Intelligence",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Insight",
//        _id: 1,
        skill: "Insight",
        attribute: "Wisdom",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Intimidation",
//        _id: 1,
        skill: "Intimidation",
        attribute: "Charisma",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Investigation",
//        _id: 1,
        skill: "Investigation",
        attribute: "Intelligence",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Nature",
//        _id: 1,
        skill: "Nature",
        attribute: "Wisdom",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Perception",
//        _id: 1,
        skill: "Perception",
        attribute: "Wisdom",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Performance",
//        _id: 1,
        skill: "Performance",
        attribute: "Charisma",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Persuasion",
//        _id: 1,
        skill: "Persuasion",
        attribute: "Charisma",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });

    
    Skill.create({
//        _id: "Religion",
//        _id: 1,
        skill: "Religion",
        attribute: "Wisdom",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Sleight of Hand",
//        _id: 1,
        skill: "Sleight of Hand",
        attribute: "Dexterity",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Stealth",
//        _id: 1,
        skill: "Stealth",
        attribute: "Dexterity",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
    
    Skill.create({
//        _id: "Survival",
//        _id: 1,
        skill: "Survival",
        attribute: "Wisdom",
    }, function(err, skill) {
        if(err) console.log(err);
        else console.log(skill);
    });
});
