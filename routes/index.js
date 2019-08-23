'use strict';

///Routing for index factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/index");
const logger = require("../config/logger");
var async = require("async");
/* GET home page. */
router.get('/', function(req, res, next) {
    var path = require("path");
    var welcomePage = require("../config/pages");
    var newPath = path.normalize(__dirname+"/..");
    var homePagePath = path.join(newPath,welcomePage);
    res.sendFile(path.resolve(homePagePath));

});

///Check login Status
router.get('/webindex', function(request,response) {
    logger.debug('routes index webindex');
 
    dbOperations.checkSession(request,response,request.userData);
           
});

///Logging out
router.get('/logout',function(request,response){
    logger.debug('routes index logout');
    dbOperations.destroySession(request,response);
});


router.get('/getFormats', function (request, response) {
    logger.debug('routes index formats');
    const formats = require("../config/printFormats");
    response.send(formats);

});



module.exports = router;
