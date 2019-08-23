'use strict';

const mongoose = require("mongoose");

const config = require("./config") 


// mongoose.connect(config.dbUrl );
mongoose.connect(config.dbUrl, function (err) {
    // Log Error
    if (err) {
        console.log('Could not connect to MongoDB!');
        process.exit();
    } else {
        console.error('Connected to MongoDB!');
        // Enabling mongoose debug mode if required
        //   mongoose.set('debug', config.db.debug);

        // Call callback FN
        //   if (cb) cb(db);
    }
})

mongoose.Promise = require('q').Promise;

module.exports = mongoose;
