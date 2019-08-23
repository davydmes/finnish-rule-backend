'use strict';

const mongoose = require("../connection");
const config = require("../config");
const utils = require("../utils");
const schema = mongoose.Schema;

const productsSchema = new schema({
    productId: {type:String,default:utils.randomNumberGenerate(10000000,99999999)},
    group : { type : mongoose.Schema.Types.ObjectId, ref : config.groupsCollection },
    productCode : String,
    name : String,
    additionalInformation : String,
    // inStore : Number,
    // busy: Number,
    unit: Number,
    sellingPrice : Number,
    vat : Number,
    purchasePrice : Number,
    shelfLocation : Number,
    picture: String,
    size : Number,
    thickness : Number,
    priceType:String,
    songs:[{
        name:String,
        date:{type:Date}
    }]
});

const Products = mongoose.model(config.productsCollection, productsSchema);

module.exports = Products;