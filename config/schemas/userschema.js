'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const userSchema = new schema({
  userId: { type : String , unique : true, required : true },
  userEmail: { type : String },
  username: { type : String , unique : true, required : true },
  password: String,
  mobile: { type : String },
  userInfo: {
    firstName : String,
    area: String,
    pincode: String,
    postOffice:String,
    accountNumber:String,
    language:String,
    taxRate:{ type : Number, default:0}
  },
  role: String,
  newRoles: [String],
  registrationDate: Date,
  settings:{
    printingPg:String,
    largePg:String,
    layoutPg:String,
    foundationPg:String,
    adhesivePg:String,
    deliveryPrice:{type:Number,default:0},
    offerValidity:{type:Number,default:0},
    productDetails:{type:Boolean,default:true},
    productCode:{type:Boolean,default:true},
    greetingText: String,
    terms:String,
    postingList:String,
    landingGround:{type:String,default:"001"},
    paybackOptions:[String],
    defaultPayment:{type:Number,default:0},
    invoiceOrderDate:{type:Boolean,default:true},
    invoicePrintText:String,
    invoiceSectiontext:String

  }
});

const User = mongoose.model(config.userCollection, userSchema);

module.exports = User;