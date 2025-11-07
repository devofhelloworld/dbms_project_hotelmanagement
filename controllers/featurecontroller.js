const guests = require("../models/manageguests");
const reservations = require("../models/managereservations");
const rooms = require("../models/managerooms");
const managehotel = require("../models/managehotel");
const manageadmin = require("../models/manageadmin");

exports.postbooking = (req,res,next)=>{

  const reservation_id ='#RS' + Math.floor(Math.random()*100000);

  const{room,checkin,checkout,adults,children,fname,lname,email,phone} = req.body;
  const special_requests = req.body.special_requests?req.body.special_requests:'none';
  const Breakfast_package = req.body.Breakfast_package?'yes':'no';
  const Airport_pickup = req.body.Airport_pickup?'yes':'no';
  const Spa_treatment = req.body.Spa_treatment?'yes':'no';
  const Early_check_in = req.body.Early_check_in?'yes':'no';

  const roomcharge = req.body.roomcharge;
  const additionalcharges = req.body.additionalcharges;
  const taxes = req.body.taxes;
  const totalamount = req.body.totalamount;
  const nights = req.body.nights;
  const bookingtime = new Date();
    const day = new Date().getDate();
    const month = new Date().getMonth()+1;
    console.log(month);
    const year = new Date().getFullYear();
  const todaysdate = day + '-' + month + '-' + year;

  const reservation = new reservations(reservation_id,room,checkin,checkout,adults,children,fname,lname,email,phone,special_requests,Breakfast_package,Airport_pickup,Spa_treatment,Early_check_in,roomcharge,additionalcharges,taxes,totalamount,nights,bookingtime,todaysdate);

  console.log(reservation);
  req.session.reservationid = reservation_id;

  reservation.save().then(()=>{

    managehotel.gethotelinfo().then(([[data]])=>{
      const hoteldata = data;
      reservations.fetchdetails(reservation_id).then(([[data]])=>{
      console.log(data);
      rooms.getroomdes(data.room).then(([[datas]])=>{
        console.log(datas);
        res.render('bookingconfirmationpage',{user:data,isloggedin:req.session.isloggedin,useremail:req.session.useremail,bookingid: req.session.reservationid,roomdes:datas.room_des,hoteldata:hoteldata});
      })
      })
      })
      })
    
}

exports.updatebookingsettings = (req,res,next)=>{
  const onlinebooking = req.body.onlinebooking?'on':'off';
  const autoconfirmations = req.body.autoconfirmations?'on':'off';
  const emailnotifications = req.body.emailnotifications?'on':'off';
  managehotel.updatebookings(onlinebooking,autoconfirmations,emailnotifications).then(()=>{
    res.redirect('/admin#settings');
  }) 
}

exports.generalsettings = (req,res,next)=>{
  
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;

  managehotel.updategeneralsettings(name,email,phone).then(()=>{
    res.redirect('/admin#settings');
  }) 
}

exports.updatepricing = (req,res,next)=>{
  const taxrate = req.body.taxrate;
  const currency = req.body.currency;
  const servicecharge = req.body.servicecharge;

  console.log(req.body);

  managehotel.updatepricingsettings(currency,taxrate,servicecharge).then(()=>{
    res.redirect('/admin#settings');
  })
}

exports.getupdateroom = (req,res,next)=>{
  const roomnumber = req.params.roomid;
  managehotel.gethotelinfo().then(([[hoteldata]])=>{
    rooms.getroombyid(roomnumber).then(([[data]])=>{
    res.render('updateroom',{isloggedin:req.session.isloggedin,isadminloggedin: req.session.isadminloggedin,current:req.url,useremail: req.session.useremail,roomdata:data,hoteldata:hoteldata});
  })
  }
  )}

exports.postupdateroom = (req,res,next)=>{
  const id = req.params.roomid;
  const {room_name,price,room_des,status,availability} = req.body;
  rooms.updateroomdetails(room_name,price,room_des,status,availability,id).then(()=>{
    res.redirect('/admin#rooms');
  })
}

exports.getaddadmin = (req,res,next)=>{
  managehotel.gethotelinfo().then(([[data]])=>{
    const hoteldata = data;
    res.render('adminaccess',{isloggedin:req.session.isloggedin,isadminloggedin: req.session.isadminloggedin,editing:'false',hoteldata:hoteldata,admindata:''})
  })
}

exports.postaddadmin = (req,res,next)=>{
  const {fname,lname,email,phone,password} = req.body;
  const admin_id ='AM' + Math.floor(Math.random()*10000);
  const admin = new manageadmin(admin_id,fname,lname,email,phone,password);
  admin.save().then(()=>{
    res.redirect('/adminlogin');
  })
}