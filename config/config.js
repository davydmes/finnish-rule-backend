'use strict';

const secrets={
    COMPANY_NAME:'ILUZEX',

    domain:process.env.APP_URL,
    port: process.env.APP_PORT,
    env: process.env.APP_ENV,

    dbUrl:process.env.DB_URL,
    dbName:process.env.DB_NAME,
    dbUrlMem:process.env.DB_MEM_URL,
    dbMemName:process.env.DB_MEM_NAME,
    clientOrigins:["http://localhost:8800","http://localhost:3000"],

    userCollection:"users",
    sessionCollection:"sessions",
    roleCollection:"roles",
    checkinCollection:"checkins",
    clientCollection:"clients",
    queuesCollection:"queues",
    billCollection: "bills",
    groupsCollection :"groups",
    productsCollection : 'products',
    jobsCollection : 'jobs',

    jwtKey:process.env.JWT_KEY,
    jwtDuration: 86400,  //expires in 24 hours 
    defaultSessionDuration:2*60*60,
    sessionType: 'multi',
    sessionCaching: 'none',

    superadminEmail:process.env.SU_EMAIL,
    defaultRole:"user",
    higherOrderRoles:["superadmin","admin"],

    SMTPS_URL:process.env.MAIL_HOST,
    SMTPS_EMAIL:process.env.MAIL_USEREMAIL,
    SMTPS_PASSWORD:process.env.MAIL_PASSWORD,

    
    // TWILIO_ACCOUNT_SID:process.env.TWILIO_ACCOUNT_SID,
    // TWILIO_AUTH_TOKEN:process.env.TWILIO_AUTH_TOKEN,
    // VALID_TWILIO_NUMBER:process.env.VALID_TWILIO_NUMBER,

    // FACEBOOK_CLIENT_ID:process.env.FACEBOOK_CLIENT_ID,
    // FACEBOOK_CLIENT_SECRET:process.FACEBOOK_CLIENT_SECRET,

    // GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET
}
module.exports=secrets;