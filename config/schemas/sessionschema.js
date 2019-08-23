'use strict';
//Schema for session database

const config = require("../config");
var mongoose;
if(config.sessionCaching === 'mongo'){
    mongoose = require("../connectionMem");
}
else{
    mongoose = require("../connection");
}

const schema = mongoose.Schema;

const sessionSchema = new schema({
    sessionId: { type: String, unique: true, required: true },
    objectId: String,
    uuId: { type: String, required: true },
    userId: String,
    userEmail: String,
    username: String,
    role: String,
    registrationDate: Date,
    mobile: String,
    newRoles: [String],
    userInfo:
        {
            firstName : String,
            lastName : String,
            area: String,
            pincode: String,
            postOffice:String,
            accountNumber:String,
            language:String,
            taxRate:{ type : Number}
        },
    createdAt: { type: Date, expires: '30d', default: Date.now },
});

const Session = mongoose.model(config.sessionCollection, sessionSchema);

module.exports = Session;