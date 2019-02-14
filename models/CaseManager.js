const Sequelize = require("sequelize");

module.exports=function(connection){

const CaseManager = connection.define('CaseManager', {
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
    email: {
        type: Sequelize.STRING,
        required: true,
        unique: true,
        validate: {
            isEmail: true,            // checks for email format (foo@bar.com)
        },
    },
    phone: {
        type: Sequelize.STRING,
    },
    // password: {
    //     type: Sequelize.STRING,
    //     required: true,
    // }
});

 return CaseManager;
 };
