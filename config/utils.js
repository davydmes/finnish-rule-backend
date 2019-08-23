'use strict';

const config = require("./config");
const Session = require('./schemas/sessionschema');
const logger = require("./logger");

const utils = {

    fillSession: function (request, response, result, responseObject) {
        logger.debug('config utils fillSession');

        //data is freezed object so no issue till not adding any new property
        var userData = result;
        userData.password = undefined;
        // userData.salt = undefined;
        // userData.passwordTokenStamp = undefined;
        // userData.emailActivationToken = undefined;
        // userData.forgotPasswordToken = undefined;
        // userData.mobileVerificationCode = undefined;
        // userData.mobileTokenStamp = undefined;
        // userData.social = undefined;

        const jwtOps = require('./jwt');

        jwtOps.fillJwtSession(request, userData, function (userData2) {
            if (userData2) {
                userData2.uuId = undefined;
                responseObject.userData = userData2;
                response.send(responseObject);
                if (responseObject.callback) {
                    responseObject.callback(null,userData2 );
                }
            }
        });

    },

    appSessionDestroy: function (id, response) {
        logger.debug('config utils appSessionDestroy');

        Session.find({ sessionId: id }).remove(function (error, result) {
            if (error) {
                logger.error(error);
                utils.response(response,'fail');
            }
            else {
                logger.debug('crud result');
                utils.response(response,'success');
            }
        });
    },



    randomStringGenerate: function (x) {
        logger.debug('config utils randomStringGenerate');
        const randomString = require("randomstring");
        return randomString.generate(x);
    },
    
    randomNumberGenerate: function (min, max) {
        logger.debug('utils randomNumberGenerate');
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

   
    response : function(response,type,message){
        var message1 = "";
        switch(type){
            case 'success': message1=message||'success'; response.json({message:message1,code:200,success:true}); break;
            case 'fail': message1=message||'Some error has occured, please try again later'; response.json({message:message1,code:500,success:false}); break;
            case 'unknown': message1=message||'Invalid Parameters'; response.json({message:message1,code:400,success:false}); break;
            case 'notFound': message1=message||'Not found'; response.json({message:message1,code:404,success:false}); break;
            case 'taken': message1=message||'Data already taken'; response.json({message:message1,code:422,success:false}); break;
            case 'unauthorized': message1=message||'Access denied'; response.json({message:message1,code:401,success:false}); break;
        };

    }

};

module.exports = utils;