'use strict';

const User = require("../schemas/userschema");
const utils =require("../utils");
const commonOperations=require("./commonoperations");
const logger = require("../logger");

const dbOperations={

    //Updating username
    changeUsername:function(username,userId,cb){
        logger.debug('crud profile changeUsername');
        
        var obj={
            "username":username,
            "notFound":undefined
        };
        commonOperations.checkUsername(obj,function(){
            if(obj.notFound===true){
                User.update({"userId":userId}, 
                {
                    $set:{
                        "username":obj.username,
                    }
                },
                function(error,result){
                    if(error){
                        cb(error,null);
                    }
                    else{ 
                        cb(null,result);
                    }
                });
            }
            else{
                cb(null,{});
            }
        });      
    },

    ////updating info
    updateProfileData:function (request,response,session){
        logger.debug('crud profile updateProfileData');
        var profileObject=request.body;
        
        User.update({
            "userId":request.body.userId
        }, 
        {
            $set:{
                "mobile":profileObject.mobile,
                "userEmail":profileObject.userEmail,
                "userInfo.firstname":profileObject.name,
                "userInfo.area":profileObject.street,
                "userInfo.pincode":profileObject.zip,
                "userInfo.postOffice":profileObject.postOffice,
                "userInfo.accountNumber":profileObject.accountNumber,
                "userInfo.language":profileObject.language,
                "userInfo.taxRate":profileObject.taxRate,
            }
        }
        ,function(error,result){
            if(error){
                logger.error(error);
                utils.response(response,'fail');
            }
            else{ 
                logger.debug('crud result'); 
                utils.response(response,'success');
            }
        });
    }, 
   

    //////Checking old password
    checkPassword:function (passwordObject,userId, cb){
        logger.debug('crud profile checkPassword');
        var that=this;

        User.findOne({
            "userId":userId
        }
        ,function(error,result){
            if(error){
                logger.error(error);
                // utils.response(response,'fail');
                cb(error,null);
            }
            else{ 
                logger.debug('crud result'); 
                if(result == undefined){
                    // utils.response(response,'notFound');
                    cb(null,result);
                }
               
                else{
                   
                    if(result.password===passwordObject.oldPassword){
                        that.setNewPassword(passwordObject.newPassword,userId,cb);
                    }
                    else{
                        cb(null,result);
                    }  
                }  
            }
        });
    },
    //////////////Setting new password
    setNewPassword:function (newPassword,userId,cb){
        logger.debug('crud profile setNewPassword');
       
    
        User.update({
            "userId":userId
        }, 
        {
            $set:{
                "password":newPassword
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

    saveSettings:function (userId,settings,cb){
        logger.debug('crud profile saveSettings');
        
        var newObj = {};
        Object.keys(settings).forEach((key)=>{
            newObj["settings."+key]=settings[key];
        })

        User.findOneAndUpdate({
            "userId":userId
        }, 
        {
            $set:newObj
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

    deleteUser: function (userId,cb) {
        logger.debug('crud profile deleteUser');

        User.findOneAndRemove({
            userId:userId
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

    getUserById: function (userId,cb) {
        logger.debug('crud profile getUserById');

        User.findOne({
            userId:userId
        },{password:false},
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
                    // if (filters[key] && key === "search") {
                    //     var regex = { $regex: filters[key], $options: "$i" }
                    //     Query["$or"] = [ 
                    //     {'basic.name':regex},
                    //     {'subscriber':regex},
                    //     {'billingAddress':regex}
                    // ];
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
        User.find(Query, {
            username:true,
            userEmail:true,
            userInfo:true,
            mobile:true,
            newRoles:true
        })
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
                    response.json({ message: "No users found", code: 404, success: false });
                }
                else {
                    response.send({ success: true, code: 200, "data": result });
                }
            }
        });
    },

};

module.exports =dbOperations;