const { Sequelize, DataTypes } = require('sequelize');


module.exports = 

/**
 * @param {Sequelize} sequelize
 */

(sequelize)=>{

const User = sequelize.user;


const UserLocation = sequelize.define("_user_location",{
  
    user_id: {
        type: DataTypes.STRING,
        primaryKey:true,
        references: {
          model: User, 
          key: 'id'
        }
      },
    lat:{
        type:DataTypes.DOUBLE,
        allowNull: false,
    },
    lng:{
      type:DataTypes.DOUBLE,
      allowNull: false,
  },
  angle:{
    type:DataTypes.DOUBLE,
    allowNull: false,
},
    
});
return UserLocation;
}