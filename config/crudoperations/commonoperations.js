'use strict';

const User = require("../schemas/userschema");
const utils = require("../utils");
const logger = require("../logger");
const config = require("../config");

const dbOperations = {

    ////////Checking if username exists  ///////////////////// 
    checkUsername: function (object, callback) {
        logger.debug('crud common checkUsername');
        
        User.findOne({ "username": object.username }, function (error, result) {
            if (error) {
                logger.error(error);
                utils.response(response,'fail');
            }
            else {
                logger.debug('crud result'); 
                if (result != undefined) {
                    object.notFound = false;
                }
                else {
                    object.notFound = true;
                }
            }
            callback();
        });
    },

 

    ///////// Mobile Application only operations////////////

    getProfileData: function (id, userData, callback) {
        logger.debug('crud common getProfileData');
        const Session = require('../schemas/sessionschema');
        Session.findOne({ sessionId: id }, function (error, result) {
            if (error) {
                logger.error(error);
                utils.response(response,'fail');
            }
            else {
                logger.debug('crud result'); 
                userData = result;
            }
            callback(userData);
        });
    },
};

module.exports = dbOperations; 
