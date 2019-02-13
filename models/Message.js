const Sequelize = require("sequelize");

module.exports=function(connection){

    const Message = connection.define('Message', {
        msgId: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        clientId: {
            type: Sequelize.UUID,
        },
        caseMgrId: {
            type: Sequelize.UUID,
        },
        message: {
            type: Sequelize.TEXT,
        },
        timeStamp : {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
    });

    return Message;
 };
