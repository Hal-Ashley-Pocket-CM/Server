const Sequelize = require("sequelize");

module.exports=function(connection){

    const Message = connection.define('Message', {
        msgId: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        author: {
            type: Sequelize.UUID,
        },
        recipient: {
            type: Sequelize.UUID,
        },
        message: {
            type: Sequelize.TEXT,
        },
    });

    return Message;
 };
