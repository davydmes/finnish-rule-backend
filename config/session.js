'use strict';

const config = require('./config');
const logger = require("../config/logger");
const validate=require("../config/validate");
const roleOps = require('./crudoperations/rolecrud');
const allUrls = require('./modules');
const confUrls = require('./confUrls');
const authUrls = allUrls.authModules;
const commonUrls = allUrls.commonModule;
const publicUrls = allUrls.publicModule;
const utils = require("./utils");
var urls = []; //Conf Urls + Auth Urls + common Urls
var surls = []; //only publicModule Urls
var curls = []; //only commonModule Urls

Object.keys(commonUrls).forEach(function(key){
    for(var i = 0;i<commonUrls[key].length;i++){
        var domain = key + commonUrls[key][i];
        urls.push(domain);
        curls.push(domain);
    }
});

Object.keys(authUrls).forEach(function(ukey){
    Object.keys(authUrls[ukey]).forEach(function(key){
        for(var i = 0;i<authUrls[ukey][key].length;i++){
            var domain = key + authUrls[ukey][key][i];
            urls.push(domain);
        }
    });
});

Object.keys(confUrls).forEach(function(key){
    for(var i = 0;i<confUrls[key].length;i++){
        var domain = key + confUrls[key][i];
        urls.push(domain);
    }
});

Object.keys(publicUrls).forEach(function(key){
    for(var i = 0;i<publicUrls[key].length;i++){
        var domain = key + publicUrls[key][i];
        surls.push(domain);
    }
});


var checkRights=function(request,response,next){
    if(curls.indexOf(request.url)>-1){
        next();
    }
    else{
        roleOps.getRole({"$in":request.userData.newRoles},(error,result)=>{
            if(result[0]){
                var rights=[];

                for(var j=0;j<result.length;j++){
                    for(var i=0;i<result[j].rights.length;i++){
                        rights.push(result[j].rights[i].url);
                    }  
                }
               
                
                if(rights.indexOf(request.url)>-1){
                    next();
                }
                else{
                    utils.response(response,'unauthorized');
                }
            }
            else{
                utils.response(response,'unauthorized');
            }
        });
    }
};

var authenticator = {

    jwtSession: function (request, response, next) {

        if(urls.indexOf(request.url)>-1){
            logger.debug('session > jwtSession');
            const jwt = require('jsonwebtoken');
            const jwtOps = require('./jwt');

            const tokenHeader = request.headers["authorization"];
            if(typeof tokenHeader !== 'undefined'){
                const tokenArray = tokenHeader.split(" ");
                const token = tokenArray[1];
                request.token = token;
                jwtOps.getUserid(token,(userData)=>{
                    if(userData){
                        request.userData = userData;
                        request.sessionMode = 'jwt';
                        jwt.verify(request.token, config.jwtKey, function (error, result) {
                            if (error) {
                                logger.error(error);
                                utils.response(response,'unauthorized');
                            }
                            else {
                                checkRights(request,response,next);
                            }
                        })
                    }
                    else{
                        utils.response(response,'unauthorized');
                    }  
                })
            }
            else if(surls.indexOf(request.url)>-1){
                next();
            }
            else{
                utils.response(response,'unauthorized');
            }
        }
        else{
            next();
        } 
    }
}

module.exports = authenticator;