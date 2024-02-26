var consts = require("../env/env_consts");
const sequelizeDb = require("../dbs/sequelize_db");
const functionsUtils = require("../utils/function_utils");
const author = require("../middlewares/author_middleware");
const { Op } = require("sequelize");
const Joi = require("joi");

const User = sequelizeDb.user;
const UserSocket = sequelizeDb.userSocket;
const UserLocation = sequelizeDb.userLocation;
const UserAuth = sequelizeDb.userAuth;
const UserZone = sequelizeDb.userZone;

var myProfile = async (req, res) => {
    res.json({
        resultStatus: consts.ResultStatus.ok,
        result: req.body.user
    });
}



const getEmplyeesLocation = async (req, res, next) => {
    var isManager = author.OnlyManager(req, res);

    if (isManager.resultStatus != consts.ResultStatus.ok) {
        return res.status(isManager.resultStatus).json(isManager);
    }


    const user = req.body.user;
    const zones = user.zones;


    var regionsId = [];
    if (zones != undefined) {
        for (var zone in zones) {
            regionsId.push(zone.region_id);
        }
    }

    User.findAll({
        attributes: {exclude: ['token']},
        include: [
            {
                model: UserLocation,
                as: "location",
                required:false
            },
            {
                model: UserZone,
                as: "zones",
                region_id: {
                    [Op.in]: regionsId
                },
                required:true
            },
            {
                model: UserSocket,
                as: "socket",
                required:false
            }
        ],
        order: [['createdAt', 'DESC']]

    }).then((result) => {
        functionsUtils.loggerInfo("getEmplyeesLocation -> find all -> " + JSON.stringify(result));
        return res.status(consts.ResultStatus.ok).json({
            resultStatus: consts.ResultStatus.ok,
            result: functionsUtils.toPlain(result)
        });
    }).catch((err) => {
        functionsUtils.loggerInfo("getEmplyeesLocation -> find all -> errror  -> " + JSON.stringify(err));
        const statusCode = err.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk;
        return res.status(statusCode).json({
            resultStatus: statusCode,
            error: err,
        });
    });
}


module.exports = {
    myProfile,
    getEmplyeesLocation
}
