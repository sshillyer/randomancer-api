"use strict";

const Controller = require('../../controller');
//const charactersModel  = require('./characters-facade');
const charactersModel = require('./characters-schema.js');

class CharactersController extends Controller {}

module.exports = new CharactersController(charactersModel);
