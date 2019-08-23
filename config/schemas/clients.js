'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const clientSchema = new schema({
    customerNumber:Number,
    customerType:{type:String,default:"customer"},
    basic:[{
        name:String,
        email:String,
        telephone:String
    }],
    companyName:String,
    businessId:String,
    terms:{type:String,default:"cash customer"},
    discount:{type:Number,default:0},
    invoiceAddress:String,
    providerId:String,
    addresses:[{
        type:{type:String,default:"billing address"},
        name1:String,
        name2:String,
        name3:String,
        deliveryAddress:String,
        zip:String,
        postOffice:String,
        country:String
    }],
    additionalInfo:String,
    comments:[{
        date:Date,
        name:String,
        comment:String
    }]
});

const Client = mongoose.model(config.clientCollection, clientSchema);

module.exports = Client;