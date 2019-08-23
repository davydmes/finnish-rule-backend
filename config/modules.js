'use strict';

//Ignore check rights and dont check token
const publicModule = {
    '/': ['','getFormats'],
    '/login/': ['login']
};
    
//Requires token and also rights
const authModules = {
   
    maintenance: {
        '/roles/': ['getRights', 'createRole', 'loadRoles', 'deleteRole', 'assignRoles', 'updateRightsByModule'],
        '/signup/': ['addUser'], 
    },
    billing: {
        '/bills/':['loadBills','deleteBill','createEditBill', 'assignUser', 'assignType'],
    },
    stock:{
        '/products/' : ['createProduct', 'loadProducts', 'editProduct', 'deleteProduct'],
    }
};

//Requires token but everyone has rights
const commonModule = {
    '/': ['webindex', 'logout'],
    '/profile/': ['changeUsername', 'updateProfileData', 'setNewPassword','saveSettings','deleteUser','loadUsers', "getUserById"],
    '/checkin/':['loadCheckins','totals','hourlyreports','startWorkingHours','editCheckins'],
    '/queue/':['createQueue', 'loadQueue', 'editQueue',  'deleteQueue'],
    '/groups/' : ['createGroup', 'loadGroups', 'editGroup', 'deleteGroup'],
    '/clients/':['loadClients','saveClient','updatePersons','updateAddresses', 'addComment', 'deleteClient'], 
    '/jobs/' : ['loadJobs', 'createJob', 'editJob', 'deleteJob']
};



//System start rights module assignment to roles
const roles={
    admin:["maintenance","billing","stock"],
    user:["billing"]
};

module.exports = {
    publicModule,authModules,commonModule,roles
}