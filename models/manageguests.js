const db = require('../utils/databaseutil');

module.exports = class guests{
  constructor(fname,lname,email,phone,password,date){
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.date = date
  }

  save(){
    return db.execute(`INSERT INTO guests(fname,email,phone,password,lname,date) VALUES (?,?,?,?,?,?)`,[this.fname,this.email,this.phone,this.password,this.lname,this.date]);
  }

  static fetchdetails(email){
    return db.execute(`SELECT * FROM guests WHERE email = '${email}'`);
  }

  static getguests(){
    return db.execute(`SELECT * FROM guests ORDER BY date DESC`);
  }
}