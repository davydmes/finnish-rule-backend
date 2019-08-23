'use strict';

const User = require("../schemas/userschema");
const logger = require("../logger");
const utils = require("../utils");

const dbOperations={

    //Check login id and password > Fill Session
    doLogin:function (request,response){
        logger.debug('crud login doLogin');
        const utils =require("../utils");
        var loginObject=request.body;
       
        User.find({
           
            "username": loginObject.loginId,
            "password": loginObject.loginPassword
        },
        function(error,result){
            if(error){
                logger.error(error);
                utils.response(response,'fail');
            }
            else{ 
                logger.debug('crud result'); 
                if(result.length<1){
                    utils.response(response,'fail',"Invalid credentials");
                }
                else{
                    
                        var responseObject={
                            message:"success",
                        };
                    
                    const checkin = require("../crudoperations/checkin");
                    checkin.checkout(result[0].userId,Date.now(),(err,res)=>{
                        if(res.lastCheckins && res.lastCheckins[0]) {
                            responseObject.lastLogin = res.lastCheckins[0]
                        }
                        
                            utils.fillSession(request,response,result[0],responseObject);
                      
                        
                    });
                    
                }  
            }
        });
    },

};

module.exports =dbOperations;