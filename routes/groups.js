'use strict';

//Routing for login factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/groups");
const validate =require("../config/validate");
const logger = require("../config/logger");
const productDbOperations = require("../config/crudoperations/products");

router.post('/loadGroups',function(request,response) {
    logger.debug('routes group loadGroup');
    
    dbOperations.loadGroup(request, response);
});

router.post('/createGroup',function(request,response){
    logger.debug('routes group createGroup');
    
    dbOperations.createGroup(request, response, function(err, result) {
        if(!err) {
            utils.response(response, 'success');
        } else {
            utils.response(response, 'fail');
        }
    });
});

router.post('/editGroup',function(request,response){
    logger.debug('routes group editGroup');
    
    if(request.body.groupId) {
        dbOperations.editGroup(request, response, function(err, result) {
            if(!err) {
                utils.response(response, 'success');
            } else {
                utils.response(response, 'fail');
            }
        });
    } else {
        utils.response(response, 'fail', 'Group Id is missing');
    }
});

router.post('/deleteGroup',function(request,response){
    logger.debug('routes group deleteGroup');
    
    if(request.body.groupId) {
        dbOperations.deleteGroup(request, response, function(err, result) {
            if(!err) {
                productDbOperations.deleteGroupProducts(request, response, (error, result) => {
                    if(!error) {
                        utils.response(response, 'success');
                    } else {
                        utils.response(response, 'fail');
                    }
                });
            } else {
                utils.response(response, 'fail');
            }
        });
    } else {
        utils.response(response, 'fail', 'Group Id is missing');
    }
});

module.exports = router;