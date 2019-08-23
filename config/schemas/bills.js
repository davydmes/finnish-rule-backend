'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const billSchema = new schema({
    client:{ type : mongoose.Schema.Types.ObjectId, ref : config.clientCollection },
    subscriber: String,
    billingAddress:String,
    terms:String,
    dueDate:String,
    orderDate:Date,
    dateOfInvoice:Date,
    invoiceNumber:Number,
    billSpecs:[{
        hide:Boolean,
        job:String,
        unit:Number,
        amount:Number,
        price:Number,
        vat:Number,
        tax:Number,
        total:Number,
        shippingMethod:String,
        deliveryTime:Date,
        serviceCharge:Number,
        serviceChargeTax: Number,
        serviceChargeTotal:Number

    }],
    priceTotal:Number,
    taxTotal:Number,
    totalTotal:Number,
    agreedPrices:String,
    freeComment:String,
    billType:{type:String,default:"bill"},
    offerType:String,
    user:{ type : mongoose.Schema.Types.ObjectId, ref : config.userCollection }

});

const Bill = mongoose.model(config.billCollection, billSchema);

module.exports = Bill;