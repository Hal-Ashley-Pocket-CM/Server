"use strict"

const Sequelize = require("sequelize");

module.exports=function(connection){

const Client = connection.define('Client', {
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    phone: {
        type: Sequelize.STRING,
    },
    active: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
    }
});

return Client;
}
