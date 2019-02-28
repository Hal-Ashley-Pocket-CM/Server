"use strict"

const Sequelize = require("sequelize");

module.exports=function(connection){

    const CheckIn = connection.define('CheckIn', {
        time : {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        lattitude:{
            required: true,
            type: Sequelize.STRING,
        },
        longitude: {
            required: true,
            type: Sequelize.STRING,
        }
    });

    return CheckIn;
 };
