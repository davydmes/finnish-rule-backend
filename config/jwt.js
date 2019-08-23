'use strict';


const Session = require("./schemas/sessionschema");
var jwt = require('jsonwebtoken');
const logger = require("./logger");
const config = require("./config");

var TokenOperations = {

    generateJwt : function(id,duration){
        logger.debug('jwt generateJwt');
        var token = jwt.sign({ userId: id }, config.jwtKey, {
            expiresIn: config.jwtDuration * duration
        });
        return token;
    },

    getUserid: function(token,callback){
        logger.debug('jwt getuserId');
        Session.findOne({sessionId:token},function(error,result){
            if(error){
                logger.error(error);
                callback(null);
            }
            else{
                if(result && result.userId){
                    callback(result);
                }
                else{
                    callback(null);
                }   
            }
        });
    },


    fillJwtSession: function(request, userData, callback){
        logger.debug('jwt fillJwtSession');
        var that = this;
        if (userData.userId) {
            var duration = 1;
            if(userData.rememberMe){
                duration = 30;
            }
            var token = that.generateJwt(userData.userId,duration);

            userData=userData.toObject();
            userData.objectId = userData._id;
            userData._id=undefined; //prevent duplicate record error
            userData.sessionId=token;
            userData.uuId = "xxxxxxxxxx";
            const uuId = request.headers["uuid"];
            if(uuId && config.sessionType !== 'single'){
                userData.uuId = uuId;
            }

            Session.find({ 
                userId : userData.userId ,
                uuId: userData.uuId
            }).remove(function (error, result) {
                if (error) {
                    logger.error(error);
                    callback(null);
                }
                else{
                    that.storeSession(userData, callback);
                }
            });
        }

    },

    storeSession: function(userData, callback){
        logger.debug('jwt storeToken');
        Session.create(userData,function(error,result){

            if(error){
                logger.error(error);
                callback(null)
            }
            else{
                callback(userData);
            }
        });
    },
};

module.exports = TokenOperations;    