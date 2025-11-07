const manageadmin = require("../models/manageadmin");
const employees = require("../models/manageemployees");
const guests = require("../models/manageguests");
const housekeepings = require("../models/managehosekeeping");
const managehotel = require("../models/managehotel");
const reservations = require("../models/managereservations");
const rooms = require("../models/managerooms");
let hoteldata;

exports.getadminpage = async(req,res,next)=>{
  let totalreservations;
  let todaysrevenue;
  let revinc;
  let reserve;
  let roomdata;
  let guestsdata;
  let monthlyrevenue;
  let averagerevenue;
  let netprofit;
  let roomrevenue;
  let breakfastrevenue=0;
  let sparevenue=0;
  let otherrevenue=0;
  let revenueperroom;
  let housekeepingdata;
  let pendingservices;
  let completedservices;
  let urgentservices;
  let staffdata;
  let activestaffs;
  let totalstaffs;
  let admin;

  await reservations.gettotalreservations().then(([[data]])=>{
    totalreservations = data['COUNT(*)'];
  })

  await reservations.gettodayrevenue().then(([[data]])=>{
    todaysrevenue = data['SUM(totalamount)'];
  })

  await reservations.getyesterdayrevenue().then(([[data]])=>{
    const yesterdayrev = data['SUM(totalamount)'];
    const percentage = ((todaysrevenue - yesterdayrev)/yesterdayrev)*100;
    revinc = percentage.toFixed(2);
  })

  await reservations.fetchdata().then(([data])=>{
    reserve = [data[0],data[1],data[2]];
  })

  await rooms.getrooms().then(([data])=>{
    roomdata = data;
  })

  await guests.getguests().then(([data])=>{
    guestsdata = data;
  })

  await reservations.getroomrevenue().then(([[data]])=>{
      roomrevenue = data['SUM(roomcharge)'];
  })

  await reservations.getmonthlyrevenue().then(([[data]])=>{
    monthlyrevenue = data['SUM(totalamount)']-data['SUM(taxes)'];
    const day = new Date().getDate();
    averagerevenue = monthlyrevenue/day;
    revenueperroom = roomrevenue/60;
    netprofit = monthlyrevenue/2;
  })

  await reservations.fetchrevenues().then(([data])=>{
    data.forEach(item=>{
      if(item.Breakfast_package=='yes'){
        breakfastrevenue += 1199 * item.nights; 
      } 
      if(item.Spa_treatment=='yes'){
        sparevenue+= 2499;
      }
      if(item.Airport_pickup=='yes'||item.Early_check_in=='yes'){
        if(item.Airport_pickup=='yes')otherrevenue+=1999;
        if(item.Early_check_in=='yes')otherrevenue+=999;
      }

    });
  })

  await housekeepings.getdata().then(([data])=>{
    housekeepingdata = [data[0],data[1],data[2]];
  })

  await housekeepings.getpendingservices().then(([[data]])=>{
    pendingservices = data['COUNT(*)'];
  })

  await housekeepings.gettodayscompletedservices().then(([[data]])=>{
    completedservices = data[`COUNT(*)`];
  })

  await housekeepings.geturgentservices().then(([[data]])=>{
    urgentservices = data['COUNT(*)'];
  })

  await employees.getdata().then(([data])=>{
    staffdata = [data[0],data[1],data[2]];
  })

  await employees.getactiveemployees().then(([[data]])=>{
    activestaffs = data['COUNT(*)'];  
  })

  await employees.gettotalemployees().then(([[data]])=>{
    totalstaffs = data['COUNT(*)'];
  })

  await managehotel.gethotelinfo().then(([[data]])=>{
    hoteldata = data;
  })

  await manageadmin.getadmincredentialsbyemail(req.session.adminemail).then(([[data]])=>{
    admin = data;
  })

  await res.render('admin',{isloggedin:req.session.isloggedin,isadminloggedin: req.session.isadminloggedin,current:req.url,useremail: req.session.useremail,totalreservations:totalreservations,todaysrevenue:todaysrevenue,revinc:revinc,reserve:reserve,roomdata:roomdata,guestsdata:guestsdata,monthlyrevenue:monthlyrevenue,averagerevenue:averagerevenue,netprofit:netprofit,roomrevenue:roomrevenue,breakfastrevenue:breakfastrevenue,sparevenue:sparevenue,otherrevenue:otherrevenue,revenueperroom:revenueperroom,housekeepingdata:housekeepingdata,pendingservices:pendingservices,completedservices:completedservices,urgentservices:urgentservices,staffdata:staffdata,activestaffs:activestaffs,totalstaffs:totalstaffs,hoteldata:hoteldata,admin:admin});
   
}

exports.gethousekeeping = (req,res,next)=>{
  res.render('housekeeping',{isloggedin:req.session.isloggedin,isadminloggedin:req.session.isadminloggedin,hoteldata:hoteldata});
}

exports.posthousekeeping = (req,res,next)=>{
  const {room,tasktype,priority,due,taskdes,assignedto,department} = req.body;
  const service_id = '#HS' + Math.ceil(Math.random()*100000);
  const Requires_special_equipment_or_supplies = req.body.Requires_special_equipment_or_supplies=='on'?'yes':'no';
  const Guest_is_present_in_room = req.body.Guest_is_present_in_room=='on'?'yes':'no';
  const Requires_supervisor_approval_before_completion = req.body.Requires_supervisor_approval_before_completion=='on'?'yes':'no';
  const Send_notification_to_guest_upon_completion = req.body.Send_notification_to_guest_upon_completion=='on'?'yes':'no';
  const Recurring_task = req.body.Recurring_task=='on'?'yes':'no';

  const service = new housekeepings(service_id,room,tasktype,priority,due,taskdes,department,Requires_special_equipment_or_supplies,Guest_is_present_in_room,Requires_supervisor_approval_before_completion,Send_notification_to_guest_upon_completion,Recurring_task,assignedto);

  service.save().then(()=> res.redirect('/admin#housekeeping'));
}

exports.updatehousekeeping = async(req,res,next)=>{
  const id = req.body.service_id;
  await housekeepings.updatestatus(id);
  res.redirect('/admin#housekeeping');
}

exports.getstaff = (req,res,next)=>{
  const id ='EMP-' + Math.ceil(Math.random()*10000);
  res.render('staff',{isloggedin:req.session.isloggedin,isadminloggedin:req.session.isadminloggedin,value:id,hoteldata:hoteldata});
}

exports.addstaff = (req,res,next)=>{
  const {fname, lname, email, phone, dob, gender, adhaar, pan, address, emp_id, department, position, employmenttype, doj, shifts, salary, reporting_manager, em_name, em_rel, em_phone, em_altphone, bank_name, bank_acc, bank_ifsc, bank_branch, skills, prev_exp, additionalnotes, status} = req.body;

  const employee = new employees(fname, lname, email, phone, dob, gender, adhaar, pan, address, emp_id, department, position, employmenttype, doj, shifts, salary, reporting_manager, em_name, em_rel, em_phone, em_altphone, bank_name, bank_acc, bank_ifsc, bank_branch, skills, prev_exp, additionalnotes, status)

  employee.save().then(()=> res.redirect('/admin#staff'));
}
