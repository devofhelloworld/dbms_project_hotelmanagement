const db = require('../utils/databaseutil');

module.exports = class managehotel{
  static gethotelinfo(){
    return db.execute(`SELECT * FROM hotelsettings`);
  }

  static updatebookings(onlinebooking,autoconfirmations,emailnotifications){
    return db.execute(`UPDATE hotelsettings SET onlinebooking = ? , autoconfirmations = ? , emailnotifications = ? `,[onlinebooking,autoconfirmations,emailnotifications]);
  }

  static updategeneralsettings(name,email,phone){
    return db.execute(`UPDATE hotelsettings SET name = ? , email = ? , phone = ? `,[name,email,phone]);
  }

  static updatepricingsettings(currency,taxrate,servicecharge){
    return db.execute(`UPDATE hotelsettings SET currency = ? , taxrate = ? , servicecharge = ? `,[currency,taxrate,servicecharge]);
  }
}