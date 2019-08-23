'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const checkinSchema = new schema({
    userId: String,
    userInfo:{ type : mongoose.Schema.Types.ObjectId, ref : config.userCollection },
    checkin: {type:Date,default:Date.now},
    checkout: {type:Date},
    ip:{type:String,default:"Could not get ip"},
    definition: String
});

const Checkin = mongoose.model(config.checkinCollection, checkinSchema);

module.exports = Checkin;