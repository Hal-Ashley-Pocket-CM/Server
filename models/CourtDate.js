"use strict"

const Sequelize = require("sequelize");

module.exports=function(connection){

    const CourtDate = connection.define('CourtDate', {
        time : {
            type: Sequelize.DATE,
            required: true,
        },
        place : {
            type: Sequelize.STRING,
            required: true,
        }
    });

    return CourtDate;
 };
