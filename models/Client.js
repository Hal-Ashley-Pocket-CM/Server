"use strict"

const Sequelize = require("sequelize");

module.exports=function(connection){

const Client = connection.define('Client', {
    firstName: {
        required: true,
        type: Sequelize.STRING,
    },
    lastName: {
        required: true,
        type: Sequelize.STRING,
    },
    phone: {
        required: true,
        unique: true,
        type: Sequelize.STRING,
    },
    active: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
    }
});

return Client;
}
