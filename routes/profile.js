'use strict';

///Routing for profile factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/profile");
const commonOperations=require("../config/crudoperations/commonoperations");
const validate =require("../config/validate");
const multer = require('multer');
const logger = require("../config/logger");



////////////Edit/Update profile data
router.post('/updateProfileData',function(request,response){
    logger.debug('routes profile updateProfileData');

    if(request.body.userId){
        if(request.body.username) request.body.username=request.body.username.toLowerCase();
        var profileObject=request.body;


        if(profileObject.username !== request.userData.username){
            dbOperations.changeUsername(profileObject.username, request.body.userId, ()=>{});
        }
        if(profileObject.oldPassword && profileObject.password && profileObject.oldPassword!==profileObject.password){
            dbOperations.checkPassword({oldPassword:profileObject.oldPassword, newPassword:profileObject.password},request.body.userId, ()=>{});
        }
        dbOperations.updateProfileData(request,response,request.userData);
    }
    else{
        utils.response(response,'unknown');
    }
});


router.post('/deleteUser', function(request, response){
    logger.debug('routes profile deleteUser');

    if(request.body.userId){
        dbOperations.deleteUser(request.body.userId, function(err, result) {
            if(!err) {
                utils.response(response, 'success');
            } else {
                utils.response(response, 'fail');
            }
        });
    }
    else{
        utils.response(response,'unknown');
    }
    

});

router.post('/getUserById', function(request, response){
    logger.debug('routes profile getUserById');

    if(request.body.userId){
        dbOperations.getUserById(request.body.userId, function(err, result) {
            if(!err) {
                response.json({ 'success':true,code:200,message:"success",data:result});
            } else {
                utils.response(response, 'fail');
            }
        });
    }
    else{
        utils.response(response,'unknown');
    }
    

});

router.post('/loadUsers', function(request, response){
    logger.debug('routes profile loadUsers');

    dbOperations.load(request,response); 
});


function uniq(a) {
    return Array.from(new Set(a));
 }
function insert(element, array) {
    array.push(element);
    array.sort(function(a, b) {
        return a - b;
    });
    return array;
}


router.post('/saveSettings',function(request,response){
    logger.debug('routes profile saveSettings');

    var settingsObj = request.body;

    if(!typeof settingsObj.productDetails === "boolean") delete settingsObj.productDetails;
    if(!typeof settingsObj.productCode === "boolean") delete settingsObj.productCode;
    if(!typeof settingsObj.invoiceOrderDate === "boolean") delete settingsObj.invoiceOrderDate;
    if(isNaN(settingsObj.deliveryPrice)) delete settingsObj.deliveryPrice;
    if(isNaN(settingsObj.offerValidity)) delete settingsObj.offerValidity;
    if(isNaN(settingsObj.defaultPayment)) delete settingsObj.defaultPayment;

    const formats = require("../config/printFormats");
    var x = formats.findIndex(x => x.id === settingsObj.landingGround);
    if(x===-1) delete settingsObj.landingGround;

    var strings=[];
    var numbers = [];
    var reg = /^EOM[0-9]+$/;
    if(settingsObj.paybackOptions && settingsObj.paybackOptions.length>0){
        for(var i=0;i<settingsObj.paybackOptions.length;i++){
            if(typeof settingsObj.paybackOptions[i] === 'number'){
                numbers.push(settingsObj.paybackOptions[i]);
            }
            else if(settingsObj.paybackOptions[i].includes("EOM")){
                if(reg.test(settingsObj.paybackOptions[i])) strings.push(settingsObj.paybackOptions[i]);
            }
        }
        
        if(settingsObj.defaultPayment && !isNaN(settingsObj.defaultPayment)){
            numbers.push(settingsObj.defaultPayment);
        }
        numbers = numbers.sort(function(a, b){return a - b});
        numbers = uniq(numbers);
        strings = strings.sort();
        strings = uniq(strings);
        var pos = [...numbers,...strings];
        settingsObj.paybackOptions = pos;
    }
    else{
        settingsObj.paybackOptions = [settingsObj.defaultPayment];
    }
    
    
    dbOperations.saveSettings(request.userData.userId,settingsObj,(err,res)=>{
        if(err){
            utils.response(response,'fail');
        }
        else{
            utils.response(response,'success');
        }
    });
    
});

module.exports = router;
