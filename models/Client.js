// Sequelize (capital) references the standard library
const Sequelize = require("sequelize");

// sequelize (lowercase) references our connection to the DB.
const sequelize = require("../config/connection.js");

module.exports = (sequelize, DataTypes) => {
  var Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.String,
  phone: DataTypes.String,
  courtDates: DataTypes.Array,
  checkIns: DataTypes.Array,
  messages: DataTypes.Array,
  active: DataTypes.Boolean

});

Client.associate = function (models) {
  models.Client.belongsTo(models.CaseManager, {
  foreignKey: {
    id: cmId
  }
});

return Client;

};
