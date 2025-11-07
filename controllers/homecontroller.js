const guests = require("../models/manageguests");
const managehotel = require("../models/managehotel");
const rooms = require("../models/managerooms");

exports.gethome = (req,res,next)=>{
  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    rooms.getrooms().then(([roomdata])=>{
      res.render('home',{isloggedin:req.session.isloggedin,useremail: req.session.useremail,hoteldata:hoteldata,roomdata:roomdata});
      console.log(roomdata);
    });
})
}

exports.book = (req,res,next)=>{
  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    if(hoteldata.onlinebooking==='off'){
      return res.redirect('/404');
    }
    guests.fetchdetails(req.session.useremail).then(([[data]])=>{
    res.render('booking',{isloggedin:req.session.isloggedin,useremail: req.session.useremail,user:data,hoteldata:hoteldata});
    })
  })
  
  
}

exports.contactus = (req,res,next)=>{
  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    res.render('contact',{isloggedin:req.session.isloggedin,useremail: req.session.useremail,hoteldata:hoteldata});
  })
}

exports.getrooms = (req,res,next)=>{

  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    rooms.getrooms().then(([roomdata])=>{
      res.render('rooms',{isloggedin:req.session.isloggedin,useremail: req.session.useremail,hoteldata:hoteldata,roomdata:roomdata});
    });
})
}