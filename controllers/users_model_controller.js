var consts = require("../env/env_consts");
const sequelizeDb = require("../dbs/sequelize_db");
const functionsUtils = require("../utils/function_utils");
const { Op } = require("sequelize");
const Bcrypt = require('bcryptjs');
const Joi = require("joi");
const auth = require("../middlewares/auth_middleware");
const SocketListeners = require("../utils/socket_utils/socket_listeners");


//create main models
const User = sequelizeDb.user;
const UserAuth = sequelizeDb.userAuth;
const UserSocket = sequelizeDb.userSocket;
const UserLocation = sequelizeDb.userLocation;
const UserZone = sequelizeDb.userZone;


const switchAppLang = async (req, res) => {
    console.log("switchAppLang -> " + JSON.stringify(req.body));
    const {
        switch_to,
    } = req.body;

    const user = req.body.user;

    const schema = Joi.object({
        switch_to: Joi.string().valid(consts.LangsCode.ar, consts.LangsCode.en).required(),
        user: Joi.allow()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const returnValue = {
            resultStatus: consts.ResultStatus.notOk,
            error: error.details[0].message.toString()
        };

        functionsUtils.loggerInfo("switchAppLang  -> Error  -> " + JSON.stringify(returnValue));
        return res.status(consts.ResultStatus.notOk).json(returnValue);
    }



    const parms = {
        user_id: user.id,
        lang_code: switch_to
    };

    await UserSocket.upsert(parms, {
        where: { user_id: user.id }
    }).then(async (updatedUserResult) => {
        const returnValue = {
            resultStatus: consts.ResultStatus.ok,
        };
        console.log("switchAppLang -> done -> " + JSON.stringify(returnValue));
        res.json(returnValue);
    }).catch((updatedError) => {
        const returnValue = {
            resultStatus: updatedError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
            error: updatedError
        };
        console.log("switchAppLang -> update -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(updatedError));
        res.json(returnValue);
    });
}




const updateLocation = async (req, res) => {
    console.log("updateLocation -> " + JSON.stringify(req.body));
    const {
        lat,
        lng,
        angle,
    } = req.body;


    const user = req.body.user;


    const schema = Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        angle: Joi.number().required(),
        user: Joi.allow()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const returnValue = {
            resultStatus: consts.ResultStatus.notOk,
            error: error.details[0].message.toString()
        };
        functionsUtils.loggerInfo("updateLocation  -> Error  -> " + JSON.stringify(returnValue));
        return res.status(consts.ResultStatus.notOk).json(returnValue);
    }



    const parms = {
        user_id: user.id,
        lat: lat,
        lng: lng,
        angle: angle,
    };


    await UserLocation.upsert(parms).then(async (updatedUserResult, isCreated) => {
        const returnValue = {
            resultStatus: consts.ResultStatus.ok,
        };
        console.log("updateLocation -> done -> " + JSON.stringify(returnValue));
        await SocketListeners.onUserLocationChanged(user.id, lat, lng, angle);
        res.json(returnValue);
    }).catch((updatedError) => {
        const returnValue = {
            resultStatus: updatedError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
            error: updatedError
        };
        console.log("updateLocation -> update -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(updatedError));
        res.json(returnValue);
    });
}


const logout = async (req, res) => {
    console.log("logout -> " + JSON.stringify(req.body));


    const user = req.body.user;

    await UserAuth.destroy({
        where: { user_id: user.id }
    }).then(async (updatedUserResult) => {
        const returnValue = {
            resultStatus: consts.ResultStatus.ok,
        };
        console.log("logout -> done -> " + JSON.stringify(returnValue));
        res.json(returnValue);
    }).catch((updatedError) => {
        const returnValue = {
            resultStatus: updatedError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
            error: updatedError
        };
        console.log("logout -> update -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(updatedError));
        res.json(returnValue);
    });
}


const updateFcmToken = async (req, res) => {
    console.log("updateFcmToken -> " + JSON.stringify(req.body));
    const {
        fcm_token,
    } = req.body;

    const user = req.body.user;

    const schema = Joi.object({
        fcm_token: Joi.string().required(),
        user: Joi.allow()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const returnValue = {
            resultStatus: consts.ResultStatus.notOk,
            error: error.details[0].message.toString()
        };
        functionsUtils.loggerInfo("updateFcmToken  -> Error  -> " + JSON.stringify(returnValue));
        return res.status(consts.ResultStatus.notOk).json(returnValue);
    }


    const parms = {
        fcm_token: fcm_token,
        user_id: user.id
    };

    await UserSocket.upsert(parms, {
        where: { user_id: user.id }
    }).then(async (updatedUserResult) => {
        const returnValue = {
            resultStatus: consts.ResultStatus.ok,
        };
        console.log("updateFcmToken -> done -> " + JSON.stringify(returnValue));
        res.json(returnValue);
    }).catch((updatedError) => {
        const returnValue = {
            resultStatus: updatedError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
            error: updatedError
        };
        console.log("updateFcmToken -> update -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(updatedError));
        res.json(returnValue);
    });
}




const access = async (req, res) => {
    console.log("access -> " + JSON.stringify(req.body));
    const {
        id,
        name,
        phone,
        email,
        role,
        token,
        regions,
    } = req.body;


    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        role: Joi.string().required(),
        token: Joi.string().required(),
        regions: Joi.array().allow(),
        user: Joi.allow()
    });

  

    const { error } = schema.validate(req.body);

    if (error) {
        const returnValue = {
            resultStatus: consts.ResultStatus.notOk,
            error: error.details[0].message.toString()
        };
        functionsUtils.loggerInfo("access  -> Error  -> " + JSON.stringify(returnValue));
        return res.status(consts.ResultStatus.notOk).json(returnValue);
    }


    var zonesParams = [];
    for (var i = 0; i < (regions??[]).length; i++) {
        var zone = regions[i];
        zonesParams.push({
            user_id: id,
            region_id: zone,
        });
    }

    const parms = {
        id: id,
        name: name,
        phone: phone,
        email: email,
        role: role,
        token: token,
    }



    User.upsert(parms, {
        include: ['zones']
    }).then((createdUserResult) => {
        const result = functionsUtils.toPlain(createdUserResult[0]);
        UserZone.destroy({
            where: { user_id: id }
        }).then(async (destroyResult) => {
            UserZone.bulkCreate(zonesParams).then(async (zonesResult) => {
                var jwt = require('jsonwebtoken');
                var key = `${result.id.toString()}_datetime_${Date.now()}`;
                jwt.sign(key, consts.jwtSecrtKey, async (jwtError, token) => {
                    if (!jwtError) {
                        const authResult = await auth.saveToken(result.id, token);
                        if (authResult.resultStatus == consts.ResultStatus.ok) {
                            const userRow = {
                                ...result,
                                token: token
                            };
                            console.log("access -> done -> " + JSON.stringify(userRow));
                            res.json({
                                resultStatus: consts.ResultStatus.ok,
                                result: userRow
                            });
                        } else {
                            console.log("access -> jwt -> saveToken -> error -> " + JSON.stringify(authResult));
                            res.status(consts.ResultStatus.somethingWrong).json({
                                resultStatus: consts.ResultStatus.somethingWrong,
                                error: jwtError,
                            });
                        }
                    } else {
                        console.log("access -> jwt -> error -> " + JSON.stringify(jwtError));
                        res.status(consts.ResultStatus.somethingWrong).json({
                            resultStatus: consts.ResultStatus.somethingWrong,
                            error: jwtError,
                        });
                    }
                });
            }).catch((updatedError) => {
                const returnValue = {
                    resultStatus: updatedError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
                    error: updatedError
                };
                console.log("updateFcmToken -> update -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(updatedError));
                res.json(returnValue);
            });
        }).catch((updatedError) => {
            const returnValue = {
                resultStatus: updatedError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
                error: updatedError
            };
            console.log("updateFcmToken -> update -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(updatedError));
            res.json(returnValue);
        });

    }).catch((createdUserError) => {
        console.log("access -> error -> " + JSON.stringify(createdUserError));
        const statusCode = createdUserError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk;
        res.status(statusCode).json({
            resultStatus: statusCode,
            error: createdUserError,
        });
    });
}

module.exports = {
    switchAppLang,
    updateFcmToken,
    access,
    updateLocation,
    logout
}
