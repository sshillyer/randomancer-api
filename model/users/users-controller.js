"use strict";

const Controller = require('../../controller');
const usersModel = require('./users-schema.js');

class CharactersController extends Controller {}

module.exports = new CharactersController(usersModel);
