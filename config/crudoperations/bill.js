'use strict';

const Bills = require("../schemas/bills");
const logger = require("../logger");
const utils = require("../utils");
const moment = require("moment");

const dbOperations={

    load: function(request, response){
        logger.debug('crud bills load');

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
                        {'basic.name':regex},
                        {'subscriber':regex},
                        {'billingAddress':regex}
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
        Bills.find(Query, {})
        .sort(SortQuery)
        .skip(count)
        .populate("client")
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
                    response.json({ message: "No bills found", code: 404, success: false });
                }
                else {
                    response.send({ success: true, code: 200, "data": result });
                }
            }
        });
    },

    save:function (bill,cb){
        logger.debug('crud bill save');

        Bills.count((err,res)=>{
            if(err){
                logger.error(err);
                cb(error,null);
            }
            else{ 
                logger.debug('crud result'); 
                bill.invoiceNumber = res + 1;
                Bills.create(bill,
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

    edit:function (id, bill,cb){
        logger.debug('crud bill edit');

        Bills.findOneAndUpdate({
            _id:id
        },{
            "$set":bill
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

    delete:function (id, cb){
        logger.debug('crud bill delete');

        Bills.findByIdAndRemove(id
        ,
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

    assignUser:function (user,order, cb){
        logger.debug('crud bill assignUser');

        Bills.findOneAndUpdate({
            _id:order
        },{
            "$set":{
                user:user
            }
        }
        ,
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

    assignType:function (order, otype, cb){
        logger.debug('crud bill assignType');

        Bills.findOneAndUpdate({
            _id:order
        },{
            "$set":{
                billType:otype
            }
        }
        ,
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
};

module.exports =dbOperations;