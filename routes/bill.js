const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/bill");
const validate =require("../config/validate");
const logger = require("../config/logger");

router.post('/loadBills',function(request,response){
    logger.debug('routes bill loadBills');
    
    dbOperations.load(request,response);
});


router.post('/createEditBill', function(request, response){
    logger.debug('routes bill saveBill');
    
    var bill = request.body;
    bill.terms = bill.terms || "cash";
    if(bill.billType !== "order" && bill.billType !== "bill"){
        bill.billType = "bill";
    }
    if(bill.dateOfInvoice){
        x = new Date(bill.dateOfInvoice);
        x.setHours(x.getHours() + 5);
        x.setMinutes(x.getMinutes() + 30);
        bill.dateOfInvoice = x;
    }
    else bill.dateOfInvoice = new Date();

    bill.priceTotal = 0;
    bill.taxTotal = 0;
    bill.totalTotal = 0;

    if(bill.billSpecs && bill.billSpecs.length>0){
        for(var i=0;i<bill.billSpecs.length;i++){
            bill.billSpecs[i].hide = bill.billSpecs[i].hide || false;
            bill.billSpecs[i].shippingMethod = bill.billSpecs[i].shippingMethod || "pickup";
    
            bill.billSpecs[i].amount = bill.billSpecs[i].amount || 0;
            bill.billSpecs[i].price = bill.billSpecs[i].price || 0;
            if(!bill.billSpecs[i].vat || isNaN(bill.billSpecs[i].vat) || bill.billSpecs[i].vat<0 || bill.billSpecs[i].vat>100){
                bill.billSpecs[i].vat = 24;
            }
            bill.billSpecs[i].serviceCharge = bill.billSpecs[i].serviceCharge || 0;
    
    
            bill.billSpecs[i].tax = (bill.billSpecs[i].vat/100)*bill.billSpecs[i].price;
            bill.billSpecs[i].total = bill.billSpecs[i].tax + bill.billSpecs[i].price;
            bill.billSpecs[i].serviceChargeTax =  (bill.billSpecs[i].vat/100)*bill.billSpecs[i].serviceCharge;
            bill.billSpecs[i].serviceChargeTotal = bill.billSpecs[i].serviceChargeTax + bill.billSpecs[i].serviceCharge;
    
            bill.priceTotal = bill.priceTotal + bill.billSpecs[i].price + bill.billSpecs[i].serviceCharge;
            bill.taxTotal = bill.taxTotal + bill.billSpecs[i].tax + bill.billSpecs[i].serviceChargeTax;
            bill.totalTotal = bill.totalTotal + bill.billSpecs[i].total + bill.billSpecs[i].serviceChargeTotal;
    
        }
    }

    delete bill.user;
    if(bill.billId){
        var id = bill.billId;
        delete bill.billId;
        delete bill.invoiceNumber;
        
        dbOperations.edit(id, bill, (err,res)=>{
            if(err){
                utils.response(response,"fail");
            }
            else{
                utils.response(response,"success");
            }
        });
    }
    else{
        delete bill.billId;
        delete bill.invoiceNumber;
        dbOperations.save(bill, (err,res)=>{
            if(err){
                console.log(err)
                utils.response(response,"fail");
            }
            else{
                response.json({
                    success:true,
                    message:"",
                    code:200,
                    data:{billId:res._id}
                });
            }
        });
    }

});

router.post('/deleteBill',function(request,response){
    logger.debug('routes bill deleteBill');
    
    if(request.body.billId){
        dbOperations.delete(request.body.billId,(err,res)=>{
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

router.post('/assignUser',function(request,response){
    logger.debug('routes bill assignUser');
    
    if(request.body.orderId){
        dbOperations.assignUser(request.userData.objectId, request.body.orderId,(err,res)=>{
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

router.post('/assignType',function(request,response){
    logger.debug('routes bill assignType');
    
    if(request.body.billId && (request.body.type === "offered" || request.body.type === "requested")){
        dbOperations.assignType(request.body.billId, request.body.type,(err,res)=>{
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


module.exports = router;