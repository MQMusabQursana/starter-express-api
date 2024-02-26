var consts = require("../env/env_consts");
const sequelizeDb = require("../dbs/sequelize_db");
const functionsUtils = require("../utils/function_utils");

//create main models
const Notification = sequelizeDb.notivication;

const getAll = async (req, res,next) => {
    functionsUtils.loggerInfo("getAll -> " + JSON.stringify(req.body));
    const user = req.body.user;
    Notification.findAll({
        where:{
            is_deleted:false,
            push_for_user_id:user.id
        },
        order: [['createdAt', 'DESC']]

    }).then((result) => {
    functionsUtils.loggerInfo("getAll -> find all -> " + JSON.stringify(result));
    return res.status(consts.ResultStatus.ok).json({
            resultStatus: consts.ResultStatus.ok,
            result: functionsUtils.toPlain(result)
        });
    }).catch((err) => {
        functionsUtils.loggerInfo("getAll -> find all -> errror  -> " + JSON.stringify(err));
        const statusCode = err.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk;
        return res.status(statusCode).json({
            resultStatus: statusCode,
            error: err,
        });
    });
}


module.exports = {
    getAll
}
