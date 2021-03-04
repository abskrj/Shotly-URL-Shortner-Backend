const mongoose = require('mongoose');

const db = {};

db.mongoose = mongoose;

db.url = require("./urlModel");
db.analytics = require("./analyticsModel");

module.exports = db;