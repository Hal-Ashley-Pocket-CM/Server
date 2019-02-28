"use strict"

const Sequelize = require("sequelize");

module.exports=function(connection){

    const Message = connection.define('Message', {
        message: {
            type: Sequelize.TEXT,
        },
        timeStamp : {
            type: Sequelize.DATE,
        },
    });

    return Message;
 };
