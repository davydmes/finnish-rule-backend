'use strict';

const User = require("../schemas/userschema");

const commonOperations=require("./commonoperations");
const logger = require("../logger");
const utils = require("../utils");
const dbOperations={

    ////Check Email > Username if already exists 
    checkUser:function (request,response){
        logger.debug('crud signup checkUser');
        var that=this;
        var userObject =request.body;

 
                    var obj={
                        "username":userObject.username,
                        "notFound":undefined
                    };
                    commonOperations.checkUsername(obj,function(){
                        if(obj.notFound==true){
                            that.addUser(request,response);
                        }
                        else{
                            utils.response(response,'taken','username already taken');
                        }
                    });
    },
    /////////////Adding new user
    addUser:function(request,response){
        logger.debug('crud signup addUser');
        const utils =require("../utils");
        const config = require('../config');
        
        var data={};
        data.userEmail=request.body.userEmail;
        data.username=request.body.username;
        data.password=request.body.password;
        data.mobile=request.body.mobile;
        data.role=config.defaultRole;
        data.userInfo = {};
        // if(request.body.firstName){
            data.userInfo.firstName = request.body.name;
            data.userInfo.area = request.body.street;
            data.userInfo.pincode = request.body.zip;
            data.userInfo.postOffice = request.body.postOffice;
            data.userInfo.accountNumber = request.body.accountNumber;
            data.userInfo.language = request.body.language;
            data.userInfo.taxRate = request.body.taxRate;

       

        data.userId = utils.randomStringGenerate(32);

        data.registrationDate=new Date();
        User.create(data,function(error,result){
            console.log(error);
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
};

module.exports =dbOperations;