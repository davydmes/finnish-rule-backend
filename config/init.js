'use strict';

const config = require('./config');
const logger = require("../config/logger");
const authUrls = require('./modules').authModules;
const confUrls = require('./confUrls');
const dbOperations= require('./crudoperations/rolecrud');


var init = {
    superAdmin:function(){
        logger.debug('init>createSuperAdmin');
        var superAdminRights = [];
        
        Object.keys(confUrls).forEach(function(key){
            for(var i = 0;i<confUrls[key].length;i++){
                var right={
                    name:confUrls[key][i],
                    path: key,
                    url: key + confUrls[key][i]
                }
                superAdminRights.push(right);
            }
        });
        
        Object.keys(authUrls).forEach(function(ukey){
            Object.keys(authUrls[ukey]).forEach(function(key){
                for(var i = 0;i<authUrls[ukey][key].length;i++){
                    var right={
                        name:authUrls[ukey][key][i],
                        path: key,
                        url: key + authUrls[ukey][key][i]
                    }
                    superAdminRights.push(right);
                }
            });
        });
        

        
        dbOperations.createSuperAdmin((error,result)=>{
            if(error){
                logger.error(error);
                process.exit();
            }
        });

        dbOperations.getRole('superadmin',(error,result)=>{
            if(error){
                logger.error(error);
                process.exit();
            }
            else{
                if(result[0]){
                    dbOperations.fillRights(result[0].roleId, superAdminRights, (error,result)=>{
                        if(error){
                            logger.error(error);
                            process.exit();
                        }
                    });
                }
                else{
                    dbOperations.createRole('superadmin',(error,result)=>{
                        if(error){
                            logger.error(error);
                            process.exit();
                        }
                        else{
                            if(result){
                                dbOperations.fillRights(result.roleId, superAdminRights, (error,result)=>{
                                    if(error){
                                        logger.error(error);
                                        process.exit();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    defaultRoleAssignment:()=>{
        const roles = require('./modules').roles;
        var moduleUrls={};

        Object.keys(authUrls).forEach(function(ukey){
            moduleUrls[ukey]=[];
            Object.keys(authUrls[ukey]).forEach(function(key){
                for(var i = 0;i<authUrls[ukey][key].length;i++){
                    var right={
                        name:authUrls[ukey][key][i],
                        path: key,
                        url: key + authUrls[ukey][key][i]
                    }
                    moduleUrls[ukey].push(right);
                }
            });
        });

        
        Object.keys(roles).forEach(function(role){
            var rights = [];
            roles[role].forEach((module)=>{
                if(moduleUrls[module]){
                    rights = [...rights,...moduleUrls[module]];
                }
            })

            dbOperations.checkAndUpdate(role,rights,(error,result)=>{
                if(error){
                    logger.error(error);
                    process.exit();
                }
            });
        })
        
    }

}

module.exports = init;