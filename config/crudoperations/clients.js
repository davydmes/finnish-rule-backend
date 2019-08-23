'use strict';

const Clients = require("../schemas/clients");
const logger = require("../logger");
const utils = require("../utils");
const moment = require("moment");

const dbOperations={

    save:function (client,cb){
        logger.debug('crud client save');

        Clients.count((err,res)=>{
            if(err){
                logger.error(err);
                cb(error,null);
            }
            else{ 
                logger.debug('crud result'); 
                client.customerNumber = res + 1;
                Clients.create(client,
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
        });
    },

    load: function(request, response){
        logger.debug('crud clients load');

        var filters = request.body.filters || {};
        var sortBy = request.body.sortBy || {};
        var count = request.body.count || 0;
        var limit = request.body.limit || 100;


        var Query = {};

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
                        { "companyName": regex },
                        {'basic.name':regex},
                        {'basic.email':regex},
                        {'basic.telephone':regex}
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
        Clients.find(Query, {})
        .sort(SortQuery)
        .skip(count)
        .limit(limit)
        .exec(function (error, result) {
            if (error) {
                console.log(error)
                logger.error(error);
                utils.response(response, 'fail');
            }
            else {
                logger.debug('crud result');
                if (result.length < 1) {
                    response.json({ message: "No clients found", code: 404, success: false });
                }
                else {
                    response.send({ success: true, code: 200, "data": result });
                }
            }
        });
    },

    savePersons:function(id,persons,cb){
        logger.debug('crud client savePersons');

        Clients.findOneAndUpdate({
            _id:id
        },{
            "$set":{basic:persons}
        },function(error,result){
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

    saveAddresses:function(id,array,cb){
        logger.debug('crud client saveAddresses');
        Clients.findOneAndUpdate({
            _id:id
        },{
            "$set":{addresses:array}
        },function(error,result){
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

    addComment:function(id, name, comment,cb){
        logger.debug('crud client addComment');

        Clients.findOneAndUpdate({
            _id:id
        },{
            "$push":{comments:{
                date:Date.now(),
                name: name,
                comment:comment
            }}
        },function(error,result){
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

    deleteClient:function (id, cb) {

        logger.debug('crud groups deleteGroup');
        
        Clients.findByIdAndRemove(id,
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

};

module.exports =dbOperations;