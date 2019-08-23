'use strict';

//Routing for login factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/checkin");
const validate =require("../config/validate");
const logger = require("../config/logger");

router.post('/loadCheckins',function(request,response){
    logger.debug('routes checkin loadCheckins');
    
    dbOperations.load(request,response);
});

router.post('/startWorkingHours',function(request,response){
    logger.debug('routes checkin startWorkingHours');
    
    dbOperations.loadLast(request.userData.userId,(err,res)=>{
        
        if(err){
            utils.response(response,"fail");
        }
        else if(!res[0] || (res && res[0] && res[0].checkout)){
            dbOperations.checkin(request.userData.userId,request.userData.objectId,Date.now(),request.ip,(err,res)=>{
                if(err){
                    utils.response(response,"fail");
                }
                else{
                    utils.response(response,"success","Checked in");
                }
            });
        }
        else{
            dbOperations.checkout(request.userData.userId,Date.now(),(err,res)=>{
                if(err){
                    utils.response(response,"fail");
                }
                else{
                    utils.response(response,"success","Checked out");
                }
            });
        }
    })
    
});

router.post('/editCheckins',function(request,response){
    logger.debug('routes checkin editCheckins');
    
    if(request.body.checkinArray && request.body.checkinArray.length>0){
        dbOperations.editCheckin(request.userData.userId,request.body.checkinArray);
        utils.response(response,"success");
    }
    else{
        utils.response(response,"unknown");
    }
});

router.get('/totals', function(request, response){
    logger.debug('routes checkin totals');

    dbOperations.total(request, response);
});

router.get('/hourlyreports', function(request, response){
    logger.debug('routes checkin hourlyreports');
    
    dbOperations.hourlyreports(request, response);
});

module.exports = router;