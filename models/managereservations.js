const db = require('../utils/databaseutil');

module.exports = class reservations{
  constructor(reservation_id,room,checkin,checkout,adults,children,fname,lname,email,phone,special_requests,Breakfast_package,Airport_pickup,Spa_treatment,Early_check_in,roomcharge,additionalcharges,taxes,totalamount,nights,bookingtime,date){
    this.reservation_id = reservation_id;
    this.room = room;
    this.checkin = checkin;
    this.checkout = checkout;
    this.adults = adults;
    this.children = children;
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.phone = phone;
    this.special_requests = special_requests;
    this.Breakfast_package = Breakfast_package;
    this.Airport_pickup = Airport_pickup;
    this.Spa_treatment = Spa_treatment;
    this.Early_check_in = Early_check_in;
    this.roomcharge = roomcharge;
    this.additionalcharges = additionalcharges;
    this.taxes = taxes;
    this.totalamount = totalamount;
    this.nights = nights;
    this.bookingtime = bookingtime;
    this.date = date;
  }

  save(){
    return db.execute(`INSERT INTO reservations(reservation_id,room,checkin,checkout,adults,children,fname,lname,email,phone,special_requests,Breakfast_package,Airport_pickup,Spa_treatment,Early_check_in,roomcharge,additionalcharges,taxes,totalamount,nights,bookingtime,date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[this.reservation_id,this.room,this.checkin,this.checkout,this.adults,this.children,this.fname,this.lname,this.email,this.phone,this.special_requests,this.Breakfast_package,this.Airport_pickup,this.Spa_treatment,this.Early_check_in,this.roomcharge,this.additionalcharges,this.taxes,this.totalamount,this.nights,this.bookingtime,this.date]);
  }

  static fetchdetails(id){
    return db.execute(`SELECT * FROM reservations WHERE reservation_id = '${id}' `)
  }

  static gettotalreservations(){
    return db.execute(`SELECT COUNT(*) FROM reservations`);
  }

  static gettodayrevenue(){
    const day = new Date().getDate();
    const month = new Date().getMonth()+1;
    const year = new Date().getFullYear();
    const todaysdate = day + '-' + month + '-' + year;
    return db.execute(`SELECT SUM(totalamount) FROM reservations WHERE date='${todaysdate}'`);
  }
  static getyesterdayrevenue(){
    const day = new Date().getDate();
    const month = new Date().getMonth()+1;
    const year = new Date().getFullYear();
    const yesterdaysdate = day-1 + '-' + month + '-' + year;
    return db.execute(`SELECT SUM(totalamount) FROM reservations WHERE date='${yesterdaysdate}'`);
  }

  static fetchdata(){
    return db.execute(`SELECT * FROM reservations ORDER BY bookingtime DESC`);
  }

  static getmonthlyrevenue(){
    const month = new Date().getMonth()+1;
    return db.execute(`SELECT SUM(totalamount),SUM(taxes) FROM reservations WHERE date LIKE '%${month}%' `)
  }

  static fetchrevenues(){
    const month = new Date().getMonth()+1;
    return db.execute(`SELECT Breakfast_package, Airport_pickup , Spa_treatment, Early_check_in, additionalcharges, nights FROM reservations WHERE date LIKE '%${month}%' `)
  }

  static getroomrevenue(){
    const month = new Date().getMonth()+1;
    return db.execute(`SELECT SUM(roomcharge) FROM reservations WHERE date LIKE '%${month}%' `);
  }
}
