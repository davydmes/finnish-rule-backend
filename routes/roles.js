'use strict';

//Routing for superadmin factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/rolecrud");
const validate = require("../config/validate");
const logger = require("../config/logger");
const allUrls = require("../config/modules");
const authUrls = allUrls.authModules;

router.get('/getRights', function (request, response) {
    logger.debug('routes roles getRights');

    response.send(authUrls);

});


router.get('/loadRoles', function (request, response) {
    logger.debug('routes roles loadRoles');

    dbOperations.loadRoles((error, result) => {
        if (error) {
            logger.error(error);
            utils.response(response,'fail');
        }
        else {
            response.send(result);
        }
    });

});

router.post('/createRole', function (request, response) {
    logger.debug('routes roles createRole');

    var isValidRole = validate.string(request.body.role);

    if (isValidRole) {

        dbOperations.getRole(request.body.role, (error, result) => {
            if (error) {
                logger.error(error);
                utils.response(response,'fail');
            }
            else {
                if (result[0]) {
                    utils.response(response,'taken','exists');
                }
                else {
                    dbOperations.createRole(request.body.role, (error, result) => {
                        if (error) {
                            logger.error(error);
                            utils.response(response,'fail');
                        }
                        else {
                            response.json({message:"success",success:true,data:{roleId:result.roleId},code:200});
                           
                        }
                    });
                }
            }
        });
    }
    else {
        utils.response(response,'unknown');
    }
});


// router.post('/updateRights', function (request, response) {
//     logger.debug('routes roles updateRole');

//     var isValidRoleid = validate.id(request.body.roleId);

//     if (isValidRoleid && request.body.rights) {
//         var input = request.body.rights;
//         var newRights = [];
//         Object.keys(authUrls).forEach(function (ukey) {
//             Object.keys(authUrls[ukey]).forEach(function (key) {
//                 for (var i = 0; i < authUrls[ukey][key].length; i++) {
//                     if (input.indexOf(authUrls[ukey][key][i]) > -1){
//                         var right = {
//                             name: authUrls[ukey][key][i],
//                             path: key,
//                             url: key + authUrls[ukey][key][i]
//                         }
//                         newRights.push(right);
//                     }
//                 }
//             });
//         });

//         dbOperations.fillRights(request.body.roleId, newRights, (error, result) => {
//             if (error) {
//                 logger.error(error);
//                 utils.response(response,'fail');
//             }
//             else {
//                 utils.response(response,'success');
//             }
//         });
//     }
//     else {
//         utils.response(response,'unknown');
//     }

// });

router.post('/deleteRole', function (request, response) {
    logger.debug('routes roles deleteRole');

    var isValidRoleid = validate.id(request.body.roleId);

    if (isValidRoleid) {
        dbOperations.deleteRole(request.body.roleId, (error, result) => {
            if (error) {
                logger.error(error);
                utils.response(response,'fail');
            }
            else {
                utils.response(response,'success');
            }
        });
    }
    else{
            utils.response(response,'unknown');
    }

});

router.post('/assignRoles', function (request, response) {
    logger.debug('routes roles assignRoles');

    if (request.body.username && request.body.roles && request.body.roles.length>0) {
        dbOperations.assignRoles(request.body.username, request.body.roles, (error, result) => {
            if (error) {
                logger.error(error);
                utils.response(response,'fail');
            }
            else {
                utils.response(response,'success');
            }
        });
    }
    else{
            utils.response(response,'unknown');
    }

});

// router.post('/assignRole', function (request, response) {
//     logger.debug('routes roles assignRole');

//     var isValidEmail = validate.email(request.body.email);
//     var isValidRole = validate.name(request.body.role);

//     if (isValidEmail && isValidRole) {
//         dbOperations.assignRole(request.body.email, request.body.role, (error, result) => {
//             if (error) {
//                 logger.error(error);
//                 utils.response(response,'fail');
//             }
//             else {
//                 utils.response(response,'success');
//             }
//         });
//     }
//     else{
//             utils.response(response,'unknown');
//     }

// });

router.post('/updateRightsByModule', function (request, response) {
    logger.debug('routes roles updateRightsByModule');

    var isValidRoleid = validate.id(request.body.roleId);

    if (isValidRoleid && request.body.modules) {
        var input = request.body.modules;
        var newRights = [];
        Object.keys(authUrls).forEach(function (ukey) {
            if(input.includes(ukey)){
                Object.keys(authUrls[ukey]).forEach(function (key) {
                    for (var i = 0; i < authUrls[ukey][key].length; i++) {
                        var right = {
                            name: authUrls[ukey][key][i],
                            path: key,
                            url: key + authUrls[ukey][key][i]
                        }
                        newRights.push(right);   
                    }
                });
            }
        });

        dbOperations.fillRights(request.body.roleId, newRights, (error, result) => {
            if (error) {
                logger.error(error);
                utils.response(response,'fail');
            }
            else {
                utils.response(response,'success');
            }
        });
    }
    else {
        utils.response(response,'unknown');
    }

});


module.exports = router;