const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const homerouter = require('./routes/homerouter');
const adminrouter = require('./routes/adminrouter');
const managehotel = require('./models/managehotel');

app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
  secret: 'Royal rajputs',
  resave: false,
  saveUninitialized: true,
}))

app.use((req,res,next)=>{

  const notres = ['/','/login','/signup','/adminlogin','/adminlogout','/admin'];

  if(notres.includes(req.path)){
    return next();
  }
  if(req.session.isloggedin){
    next();
  }
  else{
    res.redirect('/login');
  }
})

app.use((req,res,next)=>{
  if(req.url=='/adminlogin') next();

  else if(req.url.includes('/admin')){
    if(req.session.isadminloggedin){
      next();
    }
    else{
      res.redirect('/adminlogin');
    }
  }
 else next();
})

app.use(homerouter);
app.use(adminrouter);
app.use((req,res,next)=>{

  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    res.status(404).render('404',{isloggedin:req.session.isloggedin,useremail: req.session.useremail,hoteldata:hoteldata});
  })
})

const PORT = 3000;
app.listen(PORT,()=>console.log(`Server is running on the http://localhost:${PORT}`));