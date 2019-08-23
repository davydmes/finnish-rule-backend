'use strict';

const Role = require("../schemas/roleschema");
const logger = require("../logger");
const config = require("../config");

const dbOperations = {

    getRole: function (role, callback) {
        logger.debug('crud role getRole');
        Role.find({
            "$or": [
                { role: role },
                { roleId: role }
            ]
        },
            function (error, result) {
                if (error) {
                    logger.error(error);
                    callback(error, null);
                }
                else {
                    callback(null, result);
                }
            });
    },

    createRole: function (role, callback) {
        logger.debug('crud role createsuperadminrole');
        const utils = require('../utils');

        var data = {};

        data.roleId = utils.randomStringGenerate(8);
        data.role = role;

        Role.create(data, function (error, result) {
            if (error) {
                logger.error(error);
                callback(error, null);
            }
            else {
                logger.debug('crud result');
                callback(null, result);
            }
        });
    },

    createSuperAdmin: function (callback) {
        logger.debug('crud role createsuperadmin');
        const utils = require('../utils');
        const User = require('../schemas/userschema');
        User.find({
            role: "superadmin"
        }
            , function (error, result) {
                if (error) {
                    logger.error(error);
                    callback(error, null);
                }
                else {
                    logger.debug('crud result');
                    if (result.length < 1) {
                        var data = {};
                        data.userEmail = config.superadminEmail;
                        data.username = 'superadmin';
                        data.password = 'superadmin';
                        data.role = "superadmin";
                        data.newRoles = ["superadmin"];

                        data.userId = utils.randomStringGenerate(32);
                        data.registrationDate = new Date();
                        data.emailVerified = false;

                        User.create(data, function (error, result) {
                            if (error) {
                                logger.error(error);
                                callback(error, null);
                            }
                            else {
                                logger.debug('crud result');
                                const commonOps = require("./commonoperations");
                                // commonOps.sendLink(result.userEmail, "emailactivate", "emailActivationToken");
                                callback(null, result);
                            }
                        });
                    }
                    else{
                        callback(null,result[0]);
                    }
                }

            });
    },

    fillRights: function (roleId, rights, callback) {
        logger.debug('crud role fillRights');

        Role.update({
            roleId:roleId
        },{
            "$set":{
                rights:rights
            }
        }, function (error, result) {
            if (error) {
                logger.debug(error);
                callback(error,null);
            }
            else {
                logger.debug('crud result');
                callback(null,result);
            }
        })
    },
    
    deleteRole:function(roleId,callback){
        logger.debug('crud role deleteRole');
        Role.find({
            roleId:roleId,
            role:{$ne:'superadmin'}
        }).remove(function (error, result) {
            if (error) {
                logger.debug(error);
                callback(error,null);
            }
            else {
                logger.debug('crud result');
                callback(null,result);
            }
        })
    },

    loadRoles:function(callback){
        logger.debug('crud role laodRoles');
        Role.find({
            role:{$ne:"superadmin"}
        },function (error, result) {
            if (error) {
                logger.debug(error);
                callback(error,null);
            }
            else {
                logger.debug('crud result');
                callback(null,result);
            }
        })
    },
    
    assignRole:function(userEmail, role, callback){
        logger.debug('crud role assignRole');
        const User = require('../schemas/userschema');
        User.find({
            userEmail: userEmail
        }).update({
            role:role
        },function (error, result) {
            if (error) {
                logger.debug(error);
                callback(error,null);
            }
            else {
                logger.debug('crud result');
                callback(null,result);
            }
        })
    },

    assignRoles:function(username, roles, callback){
        logger.debug('crud role assignRole');
        const User = require('../schemas/userschema');
        User.find({
            username: username
        }).update({
            newRoles:roles
        },function (error, result) {
            if (error) {
                logger.debug(error);
                callback(error,null);
            }
            else {
                logger.debug('crud result');
                callback(null,result);
            }
        })
    },

    checkAndUpdate:function(role,rights,callback){
        logger.debug('crud role checkAndUpdate');

        Role.findOneAndUpdate({
            role:role
        },{
            rights:rights
        },{
            upsert:true,
            setDefaultsOnInsert:true
        },(error, result)=>{
            if (error) {
                logger.debug(error);
                callback(error,null);
            }
            else {
                logger.debug('crud result');
                callback(null,result);
            }
        })
    }

};

module.exports = dbOperations;