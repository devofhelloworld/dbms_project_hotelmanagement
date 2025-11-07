const session = require("express-session");
const guests = require("../models/manageguests");
const managehotel = require("../models/managehotel");
const manageadmin = require("../models/manageadmin");

exports.login = (req,res,next)=>{
  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    res.render('login',{isloggedin:req.session.isloggedin,useremail: req.session.useremail,hoteldata:hoteldata});
  })

  
}

exports.signup =  (req,res,next)=>{
   managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    res.render('signup',{isloggedin:req.session.isloggedin,useremail: req.session.useremail,hoteldata:hoteldata});
  })
}

exports.postsignup = (req,res,next)=>{
  console.log(req.body);
  const {fname,lname,email,phone,password} = req.body;
   
  const todaysdate = new Date();

  guests.fetchdetails(email).then(([data])=>{
    if(data.length==0){
      const user = new guests(fname,lname,email,phone,password,todaysdate);
      user.save();
      console.log('usersaved' , user);
      res.redirect('/login');
    }
    else{
      res.redirect('/login');
      console.log('here',data)
    }
  })
  
}

exports.postlogin = (req,res,next)=>{
  const {email,password} = req.body;

  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;

    guests.fetchdetails(email).then(([[data]])=>{
      if(data){
        if(data.password==password){
        req.session.isloggedin = true;
        req.session.useremail = data.email;
        res.redirect('/');
        }
        else{
          res.render('login',{isloggedin:req.session.isloggedin,useremail: req.session.useremail,hoteldata:hoteldata});
        }
      }
      else{
        res.redirect('/login');
      }
    })
  })
  
}

exports.logout = (req,res,next)=>{
  req.session.isloggedin = false;
  res.redirect('/login');
}

exports.adminlogin = (req,res,next)=>{
  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    res.render('adminlogin',{isloggedin: req.session.isloggedin,useremail: req.session.useremail,hoteldata:hoteldata});
  })
  
}

exports.adminauth = (req,res,next)=>{
  const {password,email} = req.body;
  manageadmin.getadmincredentialsbyemail(email).then(([[data]])=>{
    console.log(data);
    if(email === data.email){
    if(password==data.password){
      req.session.isadminloggedin = true;
      req.session.adminemail = data.email;
      res.redirect('/admin');
    }
    else{
      res.redirect('/adminlogin')
    }
  }
  else{
    res.redirect('/adminlogin');
  }
  })
  
}

exports.adminlogout = (req,res,next)=>{
  req.session.isadminloggedin = false;
  res.redirect('/');
}

exports.geteditadmin = (req,res,next)=>{
  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    const adminid  = req.params.adminid;
    const editing = req.query.editing ;
    console.log(editing);
    manageadmin.getadmincredentials().then(([[data]])=>{
      res.render('adminaccess',{isloggedin: req.session.isloggedin,useremail: req.session.useremail,hoteldata:hoteldata,admindata:data,editing:editing});
    })
    
  })
}

exports.posteditadmin = (req,res,next)=>{
  const {fname,lname,email,phone,password} = req.body;
  const id = req.params.adminid;

  manageadmin.updateadmincredentials(fname,lname,email,phone,password,id).then(()=>
  res.redirect('/adminlogin'));
}