var consts = require("../env/env_consts");
const sequelizeDb = require("../dbs/sequelize_db");
const admin = require("../dbs/firebase-db");
const functionsUtils = require("../utils/function_utils");
const { Op } = require("sequelize");
const user = require("../models/user");
const Joi = require("joi");
//create main models
const Notivication = sequelizeDb.notivication;
const User = sequelizeDb.user;
const UserSocket = sequelizeDb.userSocket;



const pushNotification = async (req, res) => {
    functionsUtils.loggerInfo("sendRequest -> " + JSON.stringify(req.body));
    const {
        push_type,
        push_for_user_id,
        user_name,
        en_user_role,
        ar_user_role,
        customer_name,
        document_id,
        en_request_priority,
        ar_request_priority,
        en_region,
        ar_region,
        en_city,
        ar_city,
        en_neighborhood,
        ar_neighborhood,
        en_title,
        ar_title,
        en_message,
        ar_message,

    } = req.body;


    const schema = Joi.object({
        push_type: Joi.string().valid(consts.NotivicationTypeCode.newNote, consts.NotivicationTypeCode.newRequest, consts.NotivicationTypeCode.completionNote).required(),
        push_for_user_id: Joi.string().required(),
        user_name: Joi.string().required(),
        en_user_role: Joi.string().required(),
        ar_user_role: Joi.string().required(),
        customer_name: Joi.string().required(),
        document_id: Joi.string().required(),
        en_request_priority: Joi.string().required(),
        ar_request_priority: Joi.string().required(),
        en_region: Joi.string().required(),
        ar_region: Joi.string().required(),
        en_city: Joi.string().required(),
        ar_city: Joi.string().required(),
        en_neighborhood: Joi.string().required(),
        ar_neighborhood: Joi.string().required(),
        user: Joi.allow()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const returnValue = {
            resultStatus: consts.ResultStatus.notOk,
            error: error.details[0].message.toString()
        };
        functionsUtils.loggerInfo("setStatusValue -> Error  -> " + JSON.stringify(returnValue));
        return res.status(consts.ResultStatus.notOk).json(returnValue);

    }


    var en_header;
    var ar_header;
    var en_body;
    var ar_body;

    switch (push_type) {
        case consts.NotivicationTypeCode.newRequest:
            en_header = "New Request";
            ar_header = "طلب جديد";
            en_body = `A new request has been received for Document No - ${document_id}, Priority - (${en_request_priority}), City - ${en_city}, Neighborhood - ${en_neighborhood} , Customer - ${customer_name}.`;
            ar_body = `تم استلام طلب جديد علي الوثيقة رقم` + `- ${document_id}` + `, الاهمية` + ` - ${ar_request_priority}` + `, المنطقة` + ` - ${ar_region}` + `, المدينة` +` - ${ar_city}` + `, الحي` + ` - ${ar_neighborhood}` + `, العميل` + ` - ${customer_name}` + `.`;
            break;
        case consts.NotivicationTypeCode.newNote:
            en_header = `New Note`;
            ar_header = `ملاحظة جديدة`;

            en_body = `A new note has been received by ${user_name} - ${en_user_role} on Document No - ${document_id}, Priority - (${en_request_priority}), City - ${en_city}, Neighborhood - ${en_neighborhood} , Customer - ${customer_name}.`;
            ar_body = `تم استلام ملاحظة جديدة بواسطة` + ` ${user_name} - ${ar_user_role}` + ` علي الوثيقة رقم` + `- ${document_id}` + `, الاهمية` + ` - ${ar_request_priority}` + `, المنطقة` + ` - ${ar_region}` + `, المدينة` +` - ${ar_city}` + `, الحي` + ` - ${ar_neighborhood}` + `, العميل` + ` - ${customer_name}` + `.`;
            break;
        case consts.NotivicationTypeCode.completionNote:
            en_header = "Notice of completion";
            ar_header = "إشعار بالإنتهاء";
            
            en_body = `${user_name} completed Document No - ${document_id}, Priority - (${en_request_priority}), City - ${en_city}, Neighborhood - ${en_neighborhood} , Customer - ${customer_name}.`;
            ar_body = `انتهي المعاين` + ` ${user_name} - ${ar_user_role}` + ` من الوثيقة رقم` + `- ${document_id}` + `, الاهمية` + ` - ${ar_request_priority}` + `, المنطقة` + ` - ${ar_region}` + `, المدينة` +` - ${ar_city}` + `, الحي` + ` - ${ar_neighborhood}` + `, العميل` + ` - ${customer_name}` + `.`;
            break;
    }


    const params = {
        push_type,
        push_for_user_id,
        user_name,
        en_user_role,
        ar_user_role,
        customer_name,
        document_id,
        en_request_priority,
        ar_request_priority,
        en_region,
        ar_region,
        en_city,
        ar_city,
        en_neighborhood,
        ar_neighborhood,
        en_title:en_header,
        ar_title:ar_header,
        en_message:en_body,
        ar_message:ar_body
    };


    Notivication.create(params).then(async (notificationCreatedResult) => {
        const result = functionsUtils.toPlain(notificationCreatedResult);

         UserSocket.findOne({
            where: { user_id: push_for_user_id },
        }).then((findedUserResult) => {
                const user = functionsUtils.toPlain(findedUserResult);
                const fcmToken = user.fcm_token;

                switch (user.lang_code) {
                    case consts.LangsCode.ar:
                         functionsUtils.sendNotification(fcmToken, ar_header, ar_body);
                        break;
                    case consts.LangsCode.en:
                         functionsUtils.sendNotification(fcmToken, en_header, en_body);
                        break;
                    default:
                         functionsUtils.sendNotification(fcmToken, ar_header, ar_body);
                }

        }).catch((err) => {
            functionsUtils.loggerInfo("sendRequest -> user -> errror  -> " + JSON.stringify(err));
        });

        res.json({
            resultStatus: consts.ResultStatus.ok,
            result: result
        });

    }).catch((createdError) => {
        functionsUtils.loggerInfo("sendRequest -> error -> " + JSON.stringify(createdError));
        const statusCode = createdError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk;
        res.status(statusCode).json({
            resultStatus: statusCode,
            error: createdError,
        });
    });

}




var setStatusValue = async (req, res, next) => {
    functionsUtils.loggerInfo("setStatusValue ->  --- " + JSON.stringify(req.body));

    const {
        notification_id,
        column_name,
        status
    } = req.body;

    const schema = Joi.object({
        notification_id: Joi.number().required(),
        column_name: Joi.string().valid("is_readed", "is_deleted", "is_archived").required(),
        status: Joi.boolean().required(),
        user: Joi.allow()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const returnValue = {
            resultStatus: consts.ResultStatus.notOk,
            error: error.details[0].message.toString()
        };
        functionsUtils.loggerInfo("setStatusValue  -> Error  -> " + JSON.stringify(returnValue));
        return res.status(consts.ResultStatus.notOk).json(returnValue);

    }

    const params = {
        [column_name]: status
    }

    await Notivication.update(params, {
        where: { id: notification_id }
    }).then(async (updatedNotificationResult) => {
        if (updatedNotificationResult == 1) {
            const updatedRow = await Notivication.findOne({ where: { id: notification_id } });
            const returnValue = {
                resultStatus: consts.ResultStatus.ok,
                result: updatedRow == undefined ? undefined : functionsUtils.toPlain(updatedRow)
            }
            functionsUtils.loggerInfo("setStatusValue -> done -> " + JSON.stringify(returnValue));
            return res.status(returnValue.resultStatus).json(returnValue);

        } else {
            const returnValue = {
                resultStatus: consts.ResultStatus.notOk,
                error: consts.ExeptionsCode.notUpdated
            }
            functionsUtils.loggerInfo("setStatusValue -> Error -> " + JSON.stringify(returnValue));
            return res.status(returnValue.resultStatus).json(returnValue);
        }



    }).catch((error) => {
        const returnValue = {
            resultStatus: error.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
            error: error
        };
        functionsUtils.loggerInfo("setStatusValue  -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(error));
        return res.status(consts.ResultStatus.notOk).json(returnValue);

    });
}



var readAll = async (req, res, next) => {
    functionsUtils.loggerInfo("readAll ->  --- " + JSON.stringify(req.body));
    const params = {
        "is_readed": true
    }

    const user = req.body.user;
    await Notivication.update(params, {
        where: { push_for_user_id: user.id }
    }).then(async (updatedNotificationResult) => {
        const returnValue = {
            resultStatus: consts.ResultStatus.ok,
        }
        return res.status(returnValue.resultStatus).json(returnValue);
    }).catch((error) => {
        const returnValue = {
            resultStatus: error.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
            error: error
        };
        functionsUtils.loggerInfo("setStatusValue  -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(error));
        return res.status(consts.ResultStatus.notOk).json(returnValue);
    });
}


module.exports = {
    pushNotification,
    setStatusValue,readAll
}
