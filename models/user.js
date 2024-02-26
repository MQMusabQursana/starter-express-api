const { Sequelize, DataTypes } = require('sequelize');
var consts = require("../env/env_consts");


module.exports = 
/**
 * @param {Sequelize} sequelize
 */
(sequelize)=>{
const User = sequelize.define("_user",{
    id:{
        primaryKey:true,
        type:DataTypes.STRING,
        allowNull: false,
        unique:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    email:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    phone:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    role:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    token:{
        type:DataTypes.STRING,
        allowNull: false,
    },
});

return User;
}