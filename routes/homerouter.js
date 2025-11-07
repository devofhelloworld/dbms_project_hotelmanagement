const express = require('express');
const homerouter = express.Router();
const homecontroller = require('../controllers/homecontroller')
const authcontroller = require('../controllers/authcontroller');
const featurecontroller = require('../controllers/featurecontroller');

homerouter.get('/',homecontroller.gethome);
homerouter.get('/login',authcontroller.login);
homerouter.get('/signup',authcontroller.signup);
homerouter.post('/signup',authcontroller.postsignup);
homerouter.post('/login',authcontroller.postlogin);
homerouter.get('/book',homecontroller.book);
homerouter.get('/logout',authcontroller.logout);
homerouter.post('/bookingstatus',featurecontroller.postbooking);
homerouter.get('/contact',homecontroller.contactus);
homerouter.get('/rooms',homecontroller.getrooms);

module.exports = homerouter;