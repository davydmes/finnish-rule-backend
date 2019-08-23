'use strict';

//Routing for login factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/login");
const validate =require("../config/validate");
const logger = require("../config/logger");


router.post('/login',function(request,response){
    logger.debug('routes login login');
    if(request.body.loginId){
        request.body.loginId=request.body.loginId.toLowerCase();
    }
    var loginObject=request.body;

    if(loginObject.loginId && loginObject.loginPassword && loginObject.customerId==="neemia"){
        dbOperations.doLogin(request,response);
    } else {
        utils.response(response,'unknown',"Invalid credentials");
    }
});

module.exports = router;