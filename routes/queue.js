'use strict';

//Routing for login factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/queue");
const validate =require("../config/validate");
const logger = require("../config/logger");


router.post("/loadQueue", function(request, response) {
    logger.debug('routes queue loadQueue');

    dbOperations.loadQueue(request,response, function(error, result) {
        if(!error) {
            utils.response(response,'success');
        }
    });
})


router.post('/createQueue',function(request,response){
    logger.debug('routes queue saveQueue');
    
    if(isNaN(request.body.employeeId)) {
        delete request.body.employeeId;
    }
    if(isNaN(request.body.customerId)) {
        delete request.body.customerId;
    }

    dbOperations.saveQueue(request,response, function(error, result) {
        if(!error) {
            utils.response(response,'success');
        }
    });

});

router.post('/editQueue',function(request,response){
    logger.debug('routes queue editQueue');
    
    if(isNaN(request.body.employeeId)) {
        delete request.body.employeeId;
    }
    if(isNaN(request.body.customerId)) {
        delete request.body.customerId;
    }

    if(request.body.queueId) {
        dbOperations.editQueue(request,response, function(error, result) {
            if(!error) {
                utils.response(response,'success');
            }
        });
    } else {
        utils.response(response, 'fail', 'Queue Id is missing')
    }

});

router.post('/deleteQueue',function(request,response){
    logger.debug('routes queue deleteQueue');

    if(request.body.queueId) {
        dbOperations.deleteQueue(request,response, function(error, result) {
            if(!error) {
                utils.response(response,'success');
            } else {
                utils.response(response, 'fail');
            }
        });
    } else {
        utils.response(response, 'fail', 'Queue Id is missing')
    }

});

module.exports = router;