const db = require('../utils/databaseutil');

module.exports = class housekeepings{
  constructor(service_id,room,tasktype,priority,due,taskdes,department,Requires_special_equipment_or_supplies,Guest_is_present_in_room,Requires_supervisor_approval_before_completion,Send_notification_to_guest_upon_completion,Recurring_task,assignedto){
    this.service_id = service_id;
    this.room = room;
    this.tasktype = tasktype;
    this.priority = priority;
    this.due = due;
    this.taskdes = taskdes;
    this.department = department;
    this.Requires_special_equipment_or_supplies = Requires_special_equipment_or_supplies;
    this.Guest_is_present_in_room = Guest_is_present_in_room;
    this.Requires_supervisor_approval_before_completion = Requires_supervisor_approval_before_completion;
    this.Send_notification_to_guest_upon_completion = Send_notification_to_guest_upon_completion;
    this.Recurring_task = Recurring_task;
    this.assignedto = assignedto;
  }

  save(){
    return db.execute(`INSERT INTO housekeeping(service_id,room,tasktype,priority,due,taskdes,department,Requires_special_equipment_or_supplies,Guest_is_present_in_room,Requires_supervisor_approval_before_completion,Send_notification_to_guest_upon_completion,Recurring_task,assignedto) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,[this.service_id,this.room,this.tasktype,this.priority,this.due,this.taskdes,this.department,this.Requires_special_equipment_or_supplies,this.Guest_is_present_in_room,this.Requires_supervisor_approval_before_completion,this.Send_notification_to_guest_upon_completion,this.Recurring_task,this.assignedto]);
  }

  static getdata(){
    return db.execute(`SELECT * FROM housekeeping ORDER BY due DESC`);
  }

  static getpendingservices(){
    return db.execute(`SELECT COUNT(*) FROM housekeeping WHERE status='Pending'`);
  }

  static gettodayscompletedservices(){
    const month = new Date().getMonth()+1;
    return db.execute(`SELECT COUNT(*) FROM housekeeping WHERE status='Completed' AND due LIKE '%${month}%'`);
  }

  static geturgentservices(){
    const month = new Date().getMonth()+1;
    return db.execute(`SELECT COUNT(*) FROM housekeeping WHERE priority='High' AND due LIKE '%${month}%'`);
  }

  static updatestatus(id){
    return db.execute(`UPDATE housekeeping SET status = 'Completed' WHERE service_id= '${id}'`);
  }
}