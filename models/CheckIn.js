"use strict"

const Sequelize = require("sequelize");

module.exports=function(connection){

    const CheckIn = connection.define('CheckIn', {
        time : {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        lattitude:{
            type: Sequelize.STRING,
        },
        longitude: {
            type: Sequelize.STRING,
        }
    });

    return CheckIn;
 };
