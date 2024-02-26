const { Sequelize, DataTypes } = require('sequelize');
const SocketRooms = require("../utils/socket_utils/socket_rooms");


module.exports = 

/**
 * @param {Sequelize} sequelize
 */

(sequelize)=>{

const User = sequelize.user;


const UserSocket = sequelize.define("_user_socket",{
  
    user_id: {
        type: DataTypes.STRING,
        primaryKey:true,
        references: {
          model: User, 
          key: 'id'
        }
      },
    socket_id:{
        type:DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    is_online:{
      type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
    },
    fcm_token:{
      type:DataTypes.STRING,
      allowNull: true,
  },
  lang_code:{
      type:DataTypes.STRING,
      allowNull: true,
  },
  room:{
    type:DataTypes.STRING,
    values:[SocketRooms.managers,SocketRooms.users]
  }
});
return UserSocket;
}