'use strict';

const Groups = require("../schemas/groups");
const logger = require("../logger");
const utils = require("../utils");
const moment = require("moment");

const dbOperations = {

    loadGroup:function (request, response, cb) {

        logger.debug('crud groups loadGroup');

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
                            { "name": regex }
                        ];
                    }
                    else if (filters[key]) {
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

    createGroup:function (request, response, cb) {

        logger.debug('crud groups createGroup');

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

    editGroup:function (request, response, cb) {

        logger.debug('crud groups editGroup');

        let groupId = request.body.groupId;
        delete request.body.groupId;
        
        Groups.findOneAndUpdate({
            _id: groupId
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

    deleteGroup:function (request, response, cb) {

        logger.debug('crud groups deleteGroup');

        
        Groups.findByIdAndRemove(request.body.groupId,
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
    

    getGroupById:function (id, cb) {

        logger.debug('crud groups getGroupById');

        
        Groups.findById(id,
        function(error,result) {
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