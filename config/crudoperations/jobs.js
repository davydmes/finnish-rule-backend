'use strict';

const Groups = require("../schemas/jobs");
const logger = require("../logger");
const utils = require("../utils");
const moment = require("moment");

const dbOperations = {

    loadJobs:function (request, response, cb) {

        logger.debug('crud jobs loadJobs');

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
                    // if (filters[key] && key === "search") {
                    //     var regex = { $regex: filters[key], $options: "$i" }
                    //     Query["$or"] = [{ "definition": regex }];
                    // }
                    // else 
                    if (filters[key]) {
                        Query[key] = filters[key];
                    }
                });
            }
        }
        catch (error) {
            logger.error(error);
        }

        logger.debug(Query);
        console.log(Query)
        Groups.find(Query, {})
        .sort(SortQuery)
        .skip(count)
        .limit(limit)
        .populate("orderId")
        .exec(function (error, result) {
            if (error) {
                logger.error(error);
                utils.response(response, 'fail');
            }
            else {
                logger.debug('crud result');
                if (result.length < 1) {
                    response.json({ message: "No queue found", code: 404, success: false });
                }
                else {
                    response.send({ success: true, code: 200, "data": result });
                }
            }
        });
    },

    createJob:function (request, response, cb) {

        logger.debug('crud jobs createJob');

        Groups.create({
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

    editJob:function (request, response, cb) {

        logger.debug('crud jobs editJob');

        let jobId = request.body.jobId;
        delete request.body.jobId;

        Groups.findOneAndUpdate({
            _id: jobId
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

    deleteJob:function (request, response, cb) {

        logger.debug('crud jobs deleteJob');

        Groups.findByIdAndRemove(request.body.jobId,
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