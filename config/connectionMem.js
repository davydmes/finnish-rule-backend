'use strict';

const Mongoose = require('mongoose').Mongoose;
var mongooseMem = new Mongoose();

const config = require("./config") 


mongooseMem.connect(config.dbUrlMem, function (err) {
    // Log Error
    if (err) {
        console.log(err);
        console.error('Could not connect to In memory MongoDB!');
        process.exit();
    } else {
        console.error('Connected to In memory MongoDB!');
        // Enabling mongoose debug mode if required
        //   mongoose.set('debug', config.db.debug);

        // Call callback FN
        //   if (cb) cb(db);
    }
})

mongooseMem.Promise = require('q').Promise;

module.exports = mongooseMem;
