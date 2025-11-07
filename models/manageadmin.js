const db = require('../utils/databaseutil');

module.exports = class manageadmin{
  constructor(admin_id,fname,lname,email,phone,password){
    this.admin_id = admin_id;
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.phone = phone;
    this.password = password;;
  }

  save(){
    return db.execute(`INSERT INTO admin(admin_id,fname,lname,email,phone,password) VALUES (?,?,?,?,?,?)`,[this.admin_id,this.fname,this.lname,this.email,this.phone,this.password])
  }

  static getadmincredentials(){
    return db.execute(`SELECT * FROM admin `);
  }

  static getadmincredentialsbyemail(email){
    return db.execute(`SELECT * FROM admin WHERE email = '${email}'`);
  }

  static updateadmincredentials(fname,lname,email,phone,password,id){
    return db.execute(`UPDATE admin SET email = ?, phone = ? , fname = ?, lname = ?, password = ?  WHERE admin_id = ?`,[email,phone,fname,lname,password,id]);
  }
}