const Sequelize = require('sequelize');

module.exports=function(){

const connection = new Sequelize('db','user','pass', {
    // host: 'localhost',
    dialect: 'sqlite',
    storage: 'db.sqlite',
    operatorsAliases: false,
  });
  
  connection
  .authenticate()
  .then (() => {
      console.log('Connection to database established successfully.');  
  })
  .catch(err => {
      console.error('Unable to connect to the database:', err);
  });

  return connection;

}
