const { Sequelize, DataTypes } = require('sequelize');


module.exports = 

/**
 * @param {Sequelize} sequelize
 */

(sequelize)=>{

const User = sequelize.user;


const UserZone = sequelize.define("_user_zone",{
    user_id: {
        type: DataTypes.STRING,
        references: {
          model: User, 
          key: 'id'
        }
      },
    region_id:{
        type:DataTypes.STRING,
        allowNull: false,
    },
});
return UserZone;
}