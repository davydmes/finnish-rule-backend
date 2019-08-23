'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;
const utils = require("../utils");

const roleSchema = new schema({
  roleId: { type : String , unique : true, required : true , default:utils.randomStringGenerate(8)},
  role: { type : String , unique : true, required : true },
  rights: [
    {
      name: String,
      path: String,
      url: String
    }
  ]
});

const Role = mongoose.model(config.roleCollection, roleSchema);

module.exports = Role;