var consts = require("../env/env_consts");
const sequelizeDb = require("../dbs/sequelize_db");
const functionsUtils = require("../utils/function_utils");
const { Op } = require("sequelize");

//create main models
const AppVersion = sequelizeDb.appVersion;



const checkForUpdate = async (req, res, next) => {
    functionsUtils.loggerInfo("checkForUpdate -> " + JSON.stringify(req.body));
    const { platform, version } = req.body;

    await AppVersion.findOne({
        where: {
            "platform": platform,
         }
    }).then(async(result) => {
        functionsUtils.loggerInfo("check result = " + JSON.stringify(result));
        if(result){
            const row = functionsUtils.toPlain(result);
            res.status(consts.ResultStatus.ok).json({
                resultStatus: consts.ResultStatus.ok,
                result:  {
                    check: version == row.test_v || version == row.store_v,
                    url: row.url
                } 
            });
        }else{
            res.status(consts.ResultStatus.ok).json({
                resultStatus: consts.ResultStatus.ok,
            });
        }
        
    }).catch((err) => {
        functionsUtils.loggerInfo("checkForUpdate -> error -> " + JSON.stringify(err));
        const statusCode = err.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk;
        res.status(statusCode).json({
            resultStatus: statusCode,
            error: err,
        });
    });

}
module.exports = {
    checkForUpdate,
}
