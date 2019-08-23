'use strict';

//Routing for login factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/products");
const validate =require("../config/validate");
const logger = require("../config/logger");

router.post('/loadProducts',function(request,response) {
    logger.debug('routes products loadProducts');
    
    dbOperations.loadProducts(request, response);
});

router.post('/createProduct',function(request,response){
    logger.debug('routes products createProducts');
    
    dbOperations.createProduct(request, response, function(err, result) {
        if(!err) {
            utils.response(response, 'success');
        } else {
            utils.response(response, 'fail');
        }
    });
});

router.post('/editProduct',function(request,response){
    logger.debug('routes products editProducts');

    if(request.body.productId) {
        dbOperations.editProduct(request, response, function(err, result) {
            if(!err) {
                utils.response(response, 'success');
            } else {
                utils.response(response, 'fail');
            }
        });
    } else {
        utils.response(response, 'fail', 'Product Id missing');
    }
});

router.post('/deleteProduct',function(request,response){
    logger.debug('routes products deleteProducts');
    
    if(request.body.productId) {
        dbOperations.deleteProduct(request, response, function(err, result) {
            if(!err) {
                utils.response(response, 'success');
            } else {
                utils.response(response, 'fail');
            }
        });
    } else {
        utils.response(response, 'fail', 'Product Id missing');
    }
});

module.exports = router;