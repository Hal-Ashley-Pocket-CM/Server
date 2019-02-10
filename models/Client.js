const Sequelize = require("sequelize");

module.exports=function(connection){

const Client = connection.define('Client', {
  id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
  },
  firstName: {
      type: Sequelize.STRING,
      validate: {
          isAlpha: true,            // will only allow letters
      }
  },
  lastName: {
      type: Sequelize.STRING,
      validate: {
          isAlpha: true,            // will only allow letters
      }
  },
  phone: {
      type: Sequelize.STRING,
  },
  nextCourtDate: {
      type: Sequelize.DATE,
  },
  lastCheckIn: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
  },
  lastMessage: {
      type: Sequelize.TEXT,
      defaultValue: 'Welcome to our office!',
  },
  active: {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active',
  }
});

return Client;
}
