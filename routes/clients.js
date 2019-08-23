'use strict';

//Routing for login factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/clients");
const validate =require("../config/validate");
const logger = require("../config/logger");

router.post('/loadClients',function(request,response){
    logger.debug('routes clients loadClients');
    
    dbOperations.load(request,response);
});

router.post('/saveClient', function(request, response){
    logger.debug('routes clients saveClient');
    
    if(request.body.name){
        
        var client ={
            basic:[{
                name:request.body.name,
                email:request.body.email,
                telephone:request.body.telephone        
            }],
            companyName:request.body.companyName,
            businessId:request.body.businessId,
            terms:request.body.terms || "cash customer",
            invoiceAddress:request.body.invoiceAddress,
            providerId:request.body.providerId,
            addresses:[{
                type:"billing address",
                name1:request.body.name1,
                name2:request.body.name2,
                name3:request.body.name3,
                deliveryAddress:request.body.deliveryAddress,
                zip:request.body.zip,
                postOffice:request.body.postOffice,
                country:request.body.country   
            }],
            additionalInfo:request.body.additionalInfo
        }
        if(request.body.discount && !isNaN(request.body.discount)){
            client.discount = request.body.discount;
        }
        dbOperations.save(client, (err,res)=>{
            if(err){
                utils.response(response,"fail");
            }
            else{
                response.json({
                    success:true,
                    message:"",
                    code:200,
                    data:{clientId:res._id}
                });
            }
        });
    }
    else{
        utils.response(response,"unknown");
    }
    
});


router.post('/updatePersons', function(request, response){
    logger.debug('routes clients addPerson');
    
    if(request.body.clientId && request.body.persons && request.body.persons.length>0){
        
        var persons = [];
        for(var i=0;i<request.body.persons.length;i++){
            if(request.body.persons[i].name){
                persons.push(request.body.persons[i]);
            }
        }
        dbOperations.savePersons(request.body.clientId, persons, (err,res)=>{
            if(err){
                utils.response(response,"fail");
            }
            else{
                utils.response(response,"success");
            }
        });
    }
    else{
        utils.response(response,"unknown");
    }
    
});

router.post('/updateAddresses', function(request, response){
    logger.debug('routes clients updateAddresses');
    
    if(request.body.clientId && request.body.addresses && request.body.addresses.length>0){
        
        var addresses = [];
        for(var i=0;i<request.body.addresses.length;i++){
            if(request.body.addresses[i].deliveryAddress && request.body.addresses[i].zip &&
                request.body.addresses[i].postOffice){
                request.body.addresses[i].type = request.body.addresses[i].type || 'mailing address';
                addresses.push(request.body.addresses[i]);
            }
        }

        dbOperations.saveAddresses(request.body.clientId, addresses, (err,res)=>{
            if(err){
                utils.response(response,"fail");
            }
            else{
                utils.response(response,"success");
            }
        });
    }
    else{
        utils.response(response,"unknown");
    }
    
});

router.post('/addComment', function(request, response){
    logger.debug('routes clients addComment');
    
    if(request.body.clientId && request.body.comment){
        var name = request.userData.username;
        if(request.userData.userInfo && request.userData.userInfo.firstName) name = request.userData.userInfo.firstName;
        dbOperations.addComment(request.body.clientId, name, request.body.comment, (err,res)=>{
            if(err){
                utils.response(response,"fail");
            }
            else{
                utils.response(response,"success");
            }
        });
    }
    else{
        utils.response(response,"unknown");
    }
    
});

router.post('/deleteClient', function(request, response){
    logger.debug('routes clients deleteClient');

    dbOperations.deleteClient(request.body.clientId, function(err, result) {
        if(!err) {
            utils.response(response, 'success');
        } else {
            utils.response(response, 'fail');
        }
    });

});


module.exports = router;