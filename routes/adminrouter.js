const express = require('express');
const adminrouter = express.Router();
const authcontroller = require('../controllers/authcontroller');
const admincontroller = require('../controllers/admincontroller')
const featurecontroller = require('../controllers/featurecontroller');

adminrouter.get('/adminlogin',authcontroller.adminlogin);
adminrouter.get('/adminlogout',authcontroller.adminlogout);
adminrouter.post('/adminlogin',authcontroller.adminauth);
adminrouter.get('/admin',admincontroller.getadminpage);
adminrouter.get('/housekeeping',admincontroller.gethousekeeping);
adminrouter.post('/housekeeping',admincontroller.posthousekeeping);
adminrouter.post('/admin',admincontroller.updatehousekeeping);
adminrouter.get('/addstaff',admincontroller.getstaff);
adminrouter.post('/addstaff',admincontroller.addstaff);
adminrouter.post('/bookingsettings',featurecontroller.updatebookingsettings);
adminrouter.post('/generalsettings',featurecontroller.generalsettings);
adminrouter.post('/pricing',featurecontroller.updatepricing);
adminrouter.get('/updateroom/:roomid',featurecontroller.getupdateroom);
adminrouter.post('/updateroom/:roomid',featurecontroller.postupdateroom);
adminrouter.get('/editadmin/:adminid',authcontroller.geteditadmin);
adminrouter.post('/editadmin/:adminid',authcontroller.posteditadmin);
adminrouter.get('/addadmin',featurecontroller.getaddadmin);
adminrouter.post('/addadmin',featurecontroller.postaddadmin);

module.exports = adminrouter;