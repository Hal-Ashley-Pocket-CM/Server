const Sequelize = require("sequelize");

module.exports=function(connection){

    const CheckIn = connection.define('CheckIn', {
        checkInId: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        time : {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        location : {
            type: Sequelize.STRING,
        }
    });

    return CheckIn;
 };
