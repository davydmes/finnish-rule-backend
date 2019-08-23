'use strict';

const Queue = require("../schemas/queue");
const logger = require("../logger");
const utils = require("../utils");
const moment = require("moment");

const dbOperations={

    loadQueue: function(request, response){
        logger.debug('crud queue load');

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
                            { "name": regex },
                            { "friendlyId": regex },
                            { "contentOfWork" : regex}
                        ];
                    } else 
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
        Queue.find(Query, {})
        .sort(SortQuery)
        .skip(count)
        .limit(limit)
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

    saveQueue:function (request, response, cb) {

        logger.debug('crud queues saveQueue');
        Queue.create({
            name: request.body.name,
            friendlyId : request.body.friendlyId,
            employeeId : request.body.employeeId,
            customerId : request.body.customerId,
            priority : request.body.priority,
            status: request.body.status,
            deadline : request.body.deadline,
            workAdded: request.body.workAdded,
            contentOfWork : request.body.contentOfWork,
            offer : request.body.offer,
            columns : request.body.columns
        },
        function(error,result){
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

    editQueue:function (request, response, cb) {

        logger.debug('crud queues editQueue');
        
        Queue.findOneAndUpdate({
            _id: request.body.queueId
        },
         { "$set":{
            name: request.body.name,
            friendlyId : request.body.friendlyId,
            employeeId : request.body.employeeId,
            customerId : request.body.customerId,
            priority : request.body.priority,
            status: request.body.status,
            deadline : request.body.deadline,
            workAdded: request.body.workAdded,
            contentOfWork : request.body.contentOfWork,
            offer : request.body.offer,
            columns : request.body.columns
         }
        },
        function(error,result){
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

    deleteQueue:function (request, response, cb) {
        logger.debug('crud queues deleteQueue');

        Queue.findByIdAndRemove(request.body.queueId,
        function(error,result){
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
};

module.exports = dbOperations;