const { Sequelize, DataTypes } = require('sequelize');


module.exports = 
/**
 * @param {Sequelize} sequelize
 */
(sequelize)=>{

const AppVersion = sequelize.define("_app_version",{
    platform:{
        type:DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    url:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    test_v:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    store_v:{
        type:DataTypes.STRING,
        allowNull: false,
    },
});

return AppVersion;
}