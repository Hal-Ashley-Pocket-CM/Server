const Sequelize = require("sequelize");

module.exports=function(connection){

    const CourtDate = connection.define('CourtDate', {
        courtDateId: {
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
        place : {
            type: Sequelize.STRING,
        }
    });

    return CourtDate;
 };
