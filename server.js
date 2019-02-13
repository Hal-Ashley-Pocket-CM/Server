
const connection = require('./config/connection.js')();

var db = {
    connection : connection,
    caseManager : require('./models/CaseManager.js')(connection),
    client : require('./models/Client.js')(connection),
    courtDate : require('./models/CourtDate.js')(connection),
    checkIn : require('./models/CheckIn.js')(connection),
    message : require('./models/Message.js')(connection),
};

db.connection.sync({
    logging: console.log,
    //force: true, 
});


require('./controlers/routes.js')(db);
