'use strict';

const Products = require("../schemas/products");
const logger = require("../logger");
const utils = require("../utils");
const moment = require("moment");
const config = require("../config");

const dbOperations = {

    loadProducts:function (request, response, cb) {

        logger.debug('crud products loadProducts');

        var filters = request.body.filters || {};
        var sortBy = request.body.sortBy || {};
        var count = request.body.count || 0;
        var limit = request.body.limit || 100;


        var Query = {};
        const hor = require("../config").higherOrderRoles;
        // if(!hor.includes(request.userData.role)){
        //     request.body.filters.userId = request.userData.userId;
        // }

        var SortQuery = {};
        if (sortBy.type && (sortBy.order === 1 || sortBy.order === -1)){
            SortQuery[sortBy.type] = sortBy.order;
        }

        try {
            request.body.hasFilters = false;
            Object.keys(filters).forEach(function (key) {  //only checks whether atleast a single filter exists or not
                if (filters[key] != "") {
                    request.body.hasFilters = true;
                }
            });

            if (request.body.hasFilters === true) {
                Object.keys(filters).forEach(function (key) {
                    if (filters[key] && key === "search") {
                        var regex = { $regex: filters[key], $options: "$i" }
                        Query["$or"] = [
                            { "productCode": regex },
                            { "name": regex },
                            { "additionalInformation" : regex}
                        ];
                    }
                    else if (filters[key]) {
                        var regex = { $regex: filters[key], $options: "$i" };
                        Query[key] = regex;
                    }
                });
            }
        }
        catch (error) {
            logger.error(error);
        }

        logger.debug(Query);
        console.log(Query)
        Products.find(Query, {})
        .sort(SortQuery)
        .skip(count)
        .limit(limit)
        .populate("group")
        .exec(function (error, result) {
            if (error) {
                logger.error(error);
                utils.response(response, 'fail');
            }
            else {
                logger.debug('crud result');
                if (result.length < 1) {
                    response.json({ message: "No product found", code: 404, success: false });
                }
                else {
                    response.send({ success: true, code: 200, "data": result });
                }
            }
        });
    },

    makeid : function(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    createProduct:function (request, response, cb) {

        logger.debug('crud products createProduct');
        if(request.files && request.files.picture){
            let picture = request.files.picture;
            let pictureFileName = this.makeid(12);
            picture.mv('public/temp/'+pictureFileName+'.jpg', function(err) {});
    
            request.body.picture = config.domain+'/temp/'+pictureFileName+'.jpg';
            
        }
            Products.create({
                ...request.body
            },
            function(error,result) {
                console.log(error, result);
                if(error){
                    logger.error(error);
                    cb(error,null);
                }
                else{ 
                    logger.debug('crud result'); 
                    cb(null,result);
                }
            });
                       
    },

    editProduct:function (request, response, cb) {

        logger.debug('crud products editProduct');

        let productId = request.body.productId;
        delete request.body.productId;

        if(request.files && request.files.picture){
            let picture = request.files.picture;
            let pictureFileName = this.makeid(12);
            picture.mv('public/temp/'+pictureFileName+'.jpg', function(err) {});
    
            request.body.picture = config.domain+'/temp/'+pictureFileName+'.jpg';
        }
        
        
        Products.findOneAndUpdate({
            _id: productId
        },
        { 
            "$set": {
                ...request.body
            }
        },
        function(error,result) {
            console.log(error, result);
            if(error){
                logger.error(error);
                cb(error,null);
            }
            else{ 
                logger.debug('crud result'); 
                cb(null,result);
            }
        });
    },

    deleteProduct:function (request, response, cb) {

        logger.debug('crud groups deleteProduct');
        
        Products.findByIdAndRemove(request.body.productId,
        function(error,result) {
            console.log(error, result);
            if(error){
                logger.error(error);
                cb(error,null);
            }
            else{ 
                logger.debug('crud result'); 
                cb(null,result);
            }
        });
    },

    deleteGroupProducts: function(request, response, cb) {
        logger.debug('crud groups deleteGroupProducts');
        
        Products.remove({
            group : request.body.groupId
        },
        function(error,result) {
            console.log(error, result);
            if(error){
                logger.error(error);
                cb(error,null);
            }
            else{ 
                logger.debug('crud result'); 
                cb(null,result);
            }
        });
    }

}

module.exports = dbOperations;