'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;
const utils = require("../utils");

const releasesSchema = new schema({
  version: { type : String , unique : true, required : true},
  date: { type : String , required : true },
  description: [ String ]
});

const Role = mongoose.model(config.roleCollection, releasesSchema);

module.exports = Role;