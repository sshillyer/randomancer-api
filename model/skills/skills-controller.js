"use strict";

const Controller = require('../../controller');
//const skillsModel  = require('./characters-facade');
const skillsModel = require('./skills-schema.js');

class CharactersController extends Controller {}

module.exports = new CharactersController(skillsModel);
