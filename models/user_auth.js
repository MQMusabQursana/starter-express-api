const { Sequelize, DataTypes } = require('sequelize');


module.exports = 

/**
 * @param {Sequelize} sequelize
 */

(sequelize)=>{
    const User = require("./user")(sequelize);

const UserAuth = sequelize.define("_user_auth",{
    user_id: {
        type: DataTypes.STRING,
        references: {
          model: User, 
          key: 'id'
        }
      },
    token:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
});
return UserAuth;
}