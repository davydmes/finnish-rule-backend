'use strict';

const Checkins = require("../schemas/checkin");
const logger = require("../logger");
const utils = require("../utils");
const moment = require("moment");

const dbOperations={

    checkin:function (userId, userInfo, date,ip,cb){
        logger.debug('crud checkin checkin');
        Checkins.create({
            userId:userId,
            checkin:date,
            ip:ip,
            userInfo : userInfo
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

    loadLast:function(userId,cb){
        logger.debug('crud checkin loadLast');
        Checkins
            .find({
                userId:userId
            })
            .sort({ checkin : -1 })
            .limit(1)
            .exec(function (error, result) {
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

    checkout:function (userId,date,cb){
        logger.debug('crud checkin checkout');
        Checkins
            .find({
                userId:userId
            })
            .sort({ checkin : -1 })
            .limit(3)
            .exec(function (error, result) {
            if(error){
                logger.error(error);
                cb(error,null);
            }
            else if(result[0] && !result[0].checkout){ 
                logger.debug('crud result'); 
                Checkins.findOneAndUpdate({
                    _id:result[0]._id
                },{
                    "$set":{
                        checkout:date
                    }
                },(err,res)=>{
                    if(err){
                        cb(err,null);
                    }
                    else{
                        cb(null,{lastCheckins:result,new:res});
                    }
                    
                });   
            }
            else{
                cb(null,result);
            }
        });
    },

    load: function(request, response){
        logger.debug('crud checkin load');

        var filters = request.body.filters || {};
        var sortBy = request.body.sortBy || {};
        var count = request.body.count || 0;
        var limit = request.body.limit || 100;


        var Query = {};
        // const hor = require("../config").higherOrderRoles;
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
                        Query["$or"] = [{ "definition": regex }];
                    }
                    else 
                    if (filters[key] && key === "period") {
                        if (filters.period.startDate && filters.period.endDate) {
                            var x = new Date(filters.period.startDate);
                            x.setHours(x.getHours() + 5);
                            x.setMinutes(x.getMinutes() + 30);
                            var y = new Date(filters.period.endDate);
                            y.setHours(y.getHours() + 5);
                            y.setMinutes(y.getMinutes() + 30);
                            y.setDate(y.getDate() + 1)
                            Query["checkin"] = { "$gte": x, "$lt": y};
                        }   
                    }
                    else 
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
        Checkins.find(Query, {})
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
                    response.json({ message: "No entries found", code: 404, success: false });
                }
                else {
                    response.send({ success: true, code: 200, "data": result });
                }
            }
        });
    },

    editCheckin:function(user,newCheckinsArray){
        logger.debug('crud checkin editCheckin');

        var markedForDeletion = [];
        for(var i=0;i<newCheckinsArray.length;i++){
            if(newCheckinsArray[i].delete === true){
                markedForDeletion.push(newCheckinsArray[i]._id);
            }
            else{
                var x = new Date(newCheckinsArray[i].checkin);
                x.setHours(x.getHours() + 5);
                x.setMinutes(x.getMinutes() + 30);
                var y = new Date(newCheckinsArray[i].checkout);
                y.setHours(y.getHours() + 5);
                y.setMinutes(y.getMinutes() + 30);
                Checkins.findOneAndUpdate({
                    _id:newCheckinsArray[i]._id,
                    userId:user
                },
                 { "$set":{
                        checkin: x,
                        checkout: y,
                        definition: newCheckinsArray[i].definition
                 }
                },(err,res)=>{
                    if(err){
                        console.log(err)
                        logger.error(err);
                    }
                });
            }
        }

        Checkins.remove({'_id':{'$in':markedForDeletion}},(err,res)=>{
            if(err){
                logger.error(err);
            }
        });
        
        
    },

    total: function(request, response) {
        logger.debug('crud checkin total');

        Checkins
            .find({
                userId:request.userData.userId,
                checkin: {
                    '$gte': moment(new Date()).startOf('month'),
                    '$lte' : moment(new Date()).endOf('month')
                }
            })
            .exec(function (error, result) {
                if (error) {
                    logger.error(error);
                    utils.response(response, 'fail');
                }
                else {
                    logger.debug('crud result');
                    if (result.length < 1) {
                        response.json({ message: "No entries found", code: 404, success: false });
                    }
                    else {
                        var todayCount = 0;
                        var thisWeekCount = 0;
                        var lastWeekCount = 0;
                        var thisMonthCount = 0;
                        var lastMonthCount = 0;
                        var timeNow = new Date();
                        var time1;
                        var time2;
                        var time3;
                        var end;
                        // today
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            if(time2 == time1) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                todayCount += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        // this week
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).startOf('week').format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            time3 = moment(timeNow).endOf('week').format('YYYY-MM-DD');
                            if(time2 >= time1 && time2 <= time3) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                thisWeekCount += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        // last week
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).subtract('7', 'days').startOf('week').format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            time3 = moment(timeNow).subtract('7', 'days').endOf('week').format('YYYY-MM-DD');
                            if(time2 >= time1 && time2 <= time3) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                lastWeekCount += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        // this month
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).startOf('month').format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            time3 = moment(timeNow).endOf('month').format('YYYY-MM-DD');
                            if(time2 >= time1 && time2 <= time3) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                thisMonthCount += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        // last month
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).subtract('1', 'month').startOf('week').format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            time3 = moment(timeNow).subtract('1', 'month').endOf('week').format('YYYY-MM-DD');
                            if(time2 >= time1 && time2 <= time3) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                lastMonthCount += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        var res = {
                            'today' : todayCount.toFixed(2),
                            'thisWeek' : thisWeekCount.toFixed(2),
                            'lastWeek' : lastWeekCount.toFixed(2),
                            'thisMonth' : thisMonthCount.toFixed(2),
                            'lastMonth' : lastMonthCount.toFixed(2)
                        }
                        response.send({ success: true, code: 200, "data": res });
                    }
                }
            });

    },

    hourlyreports: function(request, response) {
        logger.debug('crud checkin hourlyreports');

        Checkins
            .find({
                checkin: {
                    '$gte': moment(new Date()).startOf('month'),
                    '$lte' : moment(new Date()).endOf('month')
                }
            })
            .populate("userInfo")
            .exec(function (error, result) {
                if (error) {
                    logger.error(error);
                    utils.response(response, 'fail');
                }
                else {
                    logger.debug('crud result');
                    if (result.length < 1) {
                        response.json({ message: "No entries found", code: 404, success: false });
                    }
                    else {
                        var todayCount = {};
                        var thisWeekCount = {};
                        var lastWeekCount = {};
                        var thisMonthCount = {};
                        var lastMonthCount = {};
                        var timeNow = new Date();
                        var time1;
                        var time2;
                        var time3;
                        var end;
                        // today
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            if(todayCount[result[i].userId] == undefined) {
                                todayCount[result[i].userId] = 0;
                            }
                            if(time2 == time1) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                todayCount[result[i].userId] += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        // this week
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).startOf('week').format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            time3 = moment(timeNow).endOf('week').format('YYYY-MM-DD');
                            if(thisWeekCount[result[i].userId] == undefined) {
                                thisWeekCount[result[i].userId] = 0;
                            }
                            if(time2 >= time1 && time2 <= time3) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                thisWeekCount[result[i].userId] += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        // last week
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).subtract('7', 'days').startOf('week').format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            time3 = moment(timeNow).subtract('7', 'days').endOf('week').format('YYYY-MM-DD');
                            if(lastWeekCount[result[i].userId] == undefined) {
                                lastWeekCount[result[i].userId] = 0;
                            }
                            if(time2 >= time1 && time2 <= time3) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                lastWeekCount[result[i].userId] += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        // this month
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).startOf('month').format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            time3 = moment(timeNow).endOf('month').format('YYYY-MM-DD');
                            if(thisMonthCount[result[i].userId] == undefined) {
                                thisMonthCount[result[i].userId] = 0;
                            }
                            if(time2 >= time1 && time2 <= time3) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                thisMonthCount[result[i].userId] += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        // last month
                        for(var i=0; i<result.length; i++) {
                            time1 = moment(timeNow).subtract('1', 'month').startOf('week').format('YYYY-MM-DD');
                            time2 = moment(result[i].checkin).format('YYYY-MM-DD');
                            time3 = moment(timeNow).subtract('1', 'month').endOf('week').format('YYYY-MM-DD');
                            if(lastMonthCount[result[i].userId] == undefined) {
                                lastMonthCount[result[i].userId] = 0;
                            }
                            if(time2 >= time1 && time2 <= time3) {
                                result[i].checkout ? end = moment(result[i].checkout) : end = moment(timeNow);
                                lastMonthCount[result[i].userId] += moment.duration(end.diff(result[i].checkin)).asHours();
                            }
                        }
                        var res = [];
                        var userId;
                        for(var i=0; i<Object.keys(todayCount).length; i++) {
                            userId = result.findIndex(function(x) {
                                if(x.userId == Object.keys(todayCount)[i]) {
                                    return x;
                                }
                            });
                            res.push({
                                'today' : todayCount[result[i].userId].toFixed(2),
                                'thisWeek' : thisWeekCount[result[i].userId].toFixed(2),
                                'lastWeek' : lastWeekCount[result[i].userId].toFixed(2),
                                'thisMonth' : thisMonthCount[result[i].userId].toFixed(2),
                                'lastMonth' : lastMonthCount[result[i].userId].toFixed(2),
                                'userData' : result[userId].userInfo
                            });
                        }
                        
                        response.send({ success: true, code: 200, "data": res });
                    }
                }
            });
    }

};

module.exports =dbOperations;