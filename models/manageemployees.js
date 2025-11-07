const db = require('../utils/databaseutil');

module.exports = class employees{
  constructor(fname, lname, email, phone, dob, gender, adhaar, pan, address, emp_id, department, position, employmenttype, doj, shifts, salary, reporting_manager, em_name, em_rel, em_phone, em_altphone, bank_name, bank_acc, bank_ifsc, bank_branch, skills, prev_exp, additionalnotes, status){
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.phone = phone;
    this.dob = dob;
    this.gender = gender;
    this.adhaar = adhaar;
    this.pan = pan;
    this.address = address;
    this.emp_id = emp_id;
    this.department = department;
    this.position = position;
    this.employmenttype = employmenttype;
    this.doj = doj;
    this.shifts = shifts;
    this.salary = salary;
    this.reporting_manager = reporting_manager;
    this.em_name = em_name;
    this.em_rel = em_rel;
    this.em_phone = em_phone;
    this.em_altphone = em_altphone;
    this.bank_name = bank_name;
    this.bank_acc = bank_acc;
    this.bank_ifsc = bank_ifsc;
    this.bank_branch = bank_branch;
    this.skills = skills;
    this.prev_exp = prev_exp;
    this.additionalnotes = additionalnotes;
    this.status = status;
  }

  save(){
    return db.execute(`INSERT INTO employees(fname, lname, email, phone, dob, gender, adhaar, pan, address, emp_id, department, position, employmenttype, doj, shifts, salary, reporting_manager, em_name, em_rel, em_phone, em_altphone, bank_name, bank_acc, bank_ifsc, bank_branch, skills, prev_exp, additionalnotes, status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[this.fname ,this.lname ,this.email,this.phone,this.dob ,this.gender ,this.adhaar ,this.pan ,this.address ,this.emp_id ,this.department ,this.position ,this.employmenttype ,this.doj  ,this.shifts ,this.salary ,this.reporting_manager ,this.em_name ,this.em_rel ,this.em_phone ,this.em_altphone,this.bank_name ,this.bank_acc ,this.bank_ifsc ,this.bank_branch ,this.skills ,this.prev_exp ,this.additionalnotes ,this.status ])
  }

  static getdata(){
    return db.execute(`SELECT * FROM employees ORDER BY fname ASC`);
  }

  static getactiveemployees(){
    return db.execute(`SELECT COUNT(*) FROM employees WHERE status!='Inactive'`);
  }

  static gettotalemployees(){
    return db.execute(`SELECT COUNT(*) FROM employees`);
  }
}