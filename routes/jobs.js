'use strict';

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/jobs");
const validate =require("../config/validate");
const logger = require("../config/logger");


router.post("/loadJobs", function(request, response) {
    logger.debug('routes jobs loadJobs');

    dbOperations.loadJobs(request,response, function(error, result) {
        if(!error) {
            utils.response(response,'success');
        }
    });
});

router.post('/createJob',function(request,response) {
    logger.debug('routes jobs createJob');

    if(!request.body.orderId) {
        utils.response(response, 'fail', 'Order Id missing');
    } else {
        dbOperations.createJob(request,response, function(error, result) {
            if(!error) {
                utils.response(response,'success');
            } else {
                utils.response(response, 'fail');
            }
        });
    }
});

router.post('/editJob',function(request,response) {
    logger.debug('routes jobs editJob');

    if(!request.body.orderId || !request.body.jobId) {
        utils.response(response, 'fail', 'Fields missing');
    } else {
        dbOperations.editJob(request,response, function(error, result) {
            if(!error) {
                utils.response(response,'success');
            } else {
                utils.response(response, 'fail');
            }
        });
    }
});

router.post('/deleteJob',function(request,response) {
    logger.debug('routes jobs deleteJob');

    if(!request.body.jobId) {
        utils.response(response, 'fail', 'Job Id missing');
    } else {
        dbOperations.deleteJob(request,response, function(error, result) {
            if(!error) {
                utils.response(response,'success');
            } else {
                utils.response(response, 'fail');
            }
        });
    }

});

module.exports = router;