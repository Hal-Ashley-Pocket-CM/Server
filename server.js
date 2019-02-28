"use strict"

const connection = require('./config/connection.js')();

var db = {
    CaseManager : require('./models/CaseManager.js')(connection),
    Client : require('./models/Client.js')(connection),
    CourtDate : require('./models/CourtDate.js')(connection),
    CheckIn : require('./models/CheckIn.js')(connection),
    Message : require('./models/Message.js')(connection),
};

db.CaseManager.hasMany(db.Client); // foreignKey = CaseManagerId in Client table
db.Client.hasMany(db.CourtDate); // foreignKey = ClientId in CourtDate table
db.Client.hasMany(db.CheckIn); // foreignKey = ClientId in CheckIn table
db.Client.hasMany(db.Message); // foreignKey = ClientId in Message table

connection.sync({
//    logging: console.log,
//    force: true, 
});


require('./controlers/routes.js')(db);
