const { Sequelize, DataTypes } = require('sequelize');
var consts = require("../env/env_consts");


module.exports =
    /**
     * @param {Sequelize} sequelize
     */
    (sequelize) => {
        const User = require("./user")(sequelize);

        const Notification = sequelize.define("_notification", {
            push_type: {
                type: DataTypes.STRING,
                allowNull: false,
                values:[consts.NotivicationTypeCode.newNote,consts.NotivicationTypeCode.newRequest,,consts.NotivicationTypeCode.completionNote]
            },
            push_for_user_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            en_user_role: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ar_user_role: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            customer_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            document_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            en_request_priority:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            ar_request_priority:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            en_region: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ar_region: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            en_city: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ar_city: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            en_neighborhood: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ar_neighborhood: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            en_title: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            ar_title: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            en_message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            ar_message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
           
            is_readed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue:false
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue:false
            },
            is_archived: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue:false
            },
        });
        return Notification;
    }