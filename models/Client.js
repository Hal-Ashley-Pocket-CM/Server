const Sequelize = require("sequelize");

module.exports=function(connection){

const Client = connection.define('Client', {
    clientId: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    phone: {
        type: Sequelize.STRING,
    },
    caseMgrId : {
        type: Sequelize.UUID,
    },
    active: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
    }
//   nextCourtDate: {
//       type: Sequelize.UUID,
//   },
//   lastCheckIn: {
//       type: Sequelize.UUID,
//   },
//   lastMessage: {
//       type: Sequelize.UUID,
//   },
});

return Client;
}
