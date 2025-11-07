const db = require('../utils/databaseutil');

module.exports = class rooms{
  static getroomdes(roomname){
    return db.execute(`SELECT room_des FROM rooms WHERE room_name = '${roomname}'`);
  }

  static getrooms(){
    return db.execute(`SELECT * FROM rooms`);
  }

  static getroombyid(id){
    return db.execute(`SELECT * FROM rooms WHERE room_id = '${id}'`);
  }

  static updateroomdetails(room_name,price,room_des,status,availability,id){
    return db.execute(`UPDATE rooms SET room_name = ? , price = ? , room_des = ? ,status = ? , availability = ? WHERE room_id= ?`,[room_name,price,room_des,status,availability,id]);
  }
}