const Sequelize = require("sequelize");

module.exports=function(connection){

    const CheckIn = connection.define('CheckIn', {
        checkInId: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        clientId: {
            type: Sequelize.UUID,
        },
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
