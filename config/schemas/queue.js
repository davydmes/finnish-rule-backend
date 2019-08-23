'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const queueSchema = new schema({
    name: String,
    friendlyId : String,
    employeeId : Number,
    customerId : Number,
    priority : String,
    status: String,
    deadline : String,
    workAdded: String,
    contentOfWork : String,
    offer : String,
    columns : [String]
});

const Queue = mongoose.model(config.queuesCollection, queueSchema);

module.exports = Queue;