const Sequelize = require("sequelize");

module.exports=function(connection){

    const CourtDate = connection.define('CourtDate', {
        time : {
            type: Sequelize.DATE,
        },
        place : {
            type: Sequelize.STRING,
        }
    });

    return CourtDate;
 };
