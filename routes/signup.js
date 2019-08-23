'use strict';

///Routing for register factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/signup");
const validate =require("../config/validate");
const logger = require("../config/logger");


router.post('/addUser',function(request,response){
    logger.debug('routes signup addUser');
    if(request.body.username) request.body.username=request.body.username.toLowerCase();
    if(request.body.userEmail) request.body.userEmail=request.body.userEmail.toLowerCase();
    var userObject=request.body;

    if(userObject.username && userObject.password){
        dbOperations.checkUser(request,response);
    }
    else{
        utils.response(response,'unknown');
    }
});

module.exports = router;