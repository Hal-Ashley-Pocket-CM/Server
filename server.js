const express = require('express');
const app = express();

const connection = require('./config/connection.js')();

const CaseManager = require('./models/CaseManager.js')(connection);
const Client = require('./models/Client.js')(connection);


connection.sync({
    logging: console.log,
    force: true,
})
.then (() => {
    Client.create({
        firstName: 'Billy',
        lastName: 'Sims',
        phone:"555-200-2020",
        lastCheckIn: '2019-02-07 21:34:00',
        nextCourtDate: '2019-02-28 10:30:00',
        lastMessage: "You are Back!"
    })
    .then (() => {
        connection.query('SELECT * FROM Clients').then(myTablesRows => {
            console.log(myTablesRows);
        });
    });
    CaseManager.create({
        firstName: 'Earl',
        lastName: 'Campbell',
        email: "tyrose34@cpu.com",
        phone: "555-343-3434",
    })
    .then (() => {
        connection.query('SELECT * FROM CaseManagers').then(myTablesRows => {
            console.log(myTablesRows);
        });
    });
});

// CaseManager.associate = function(models) {
//     models.CaseManager.hasMany(models.Client);
// };


require('./controlers/routes.js')(app);

app.use(express.static('./public'))
app.listen(4200, function(){ console.log('Server listening on 4200')});
