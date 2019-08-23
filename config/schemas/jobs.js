'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const jobsSchema = new schema (
    {
        orderId : { type : mongoose.Schema.Types.ObjectId, ref : config.billCollection },
    },
    {   
        strict: false
    }
);

const Jobs = mongoose.model(config.jobsCollection, jobsSchema);

module.exports = Jobs;