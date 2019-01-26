const express = require('express');
const app = express();
/*
//const db = require('C:/Users/hende/node-course/server/models');
// Sequelize (capital) references the standard library
const Sequelize = require("sequelize");

// sequelize (lowercase) references our connection to the DB.
const sequelize = require("./config/connection.js");

// const db = require('./Models/Client.js');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
*/

require('./controlers/routes.js')(app);

app.use(express.static('./public'))
app.listen(4200, function(){ console.log('Server listening on 4200')});
