const consts = require('../env/env_consts');
var jwt = require('jsonwebtoken');
const sequelizeDb = require("../dbs/sequelize_db");
const functionsUtils = require("../utils/function_utils");

const User = sequelizeDb.user;
const UserAuth = sequelizeDb.userAuth;
const UserSocket = sequelizeDb.userSocket;
const UserLocation = sequelizeDb.userLocation;
const UserZone = sequelizeDb.userZone;


var decodeToken = async (token) => {
  return new Promise(async function (resolve, reject) {
    console.log("decodeToken  -> " + token);

    if(!token){
    return resolve(undefined);
    }

    var jwtToken = jwt.decode(token);
    var key = jwtToken.toString().split('_datetime_')[0];
    console.log("token key -> " + key);

    User.findOne({
      where: {
        id: key
      }, include: [
        {
          model: UserAuth,
          as: "auth",
        },
        {
          model: UserSocket,
          as: "socket"
        },
        {
          model: UserLocation,
          as: "location"
        },
        {
          model: UserZone,
          as: "zones"
        },
      ]
    }).then((result) => {
      if (result != undefined) {
        const userRow = {
          ...functionsUtils.toPlain(result),
          token: token
        }
        console.log("decodeToken -> done --- " + JSON.stringify(userRow));
       return resolve(userRow);
      } else {
        console.log("decodeToken -> not founded");
        return resolve(undefined);

      }
    }).catch((err) => {
      console.log("decodeToken -> error  -> " + JSON.stringify(err));

      return resolve(undefined);

    });

  });
}

var checkToken = async function (token) {
  return new Promise(async function (resolve, reject) {
    console.log("checkToken -> {" + token + "}");

    await UserAuth.findOne({ where: { token: token } }).then((result) => {
      if (result != undefined) {
        console.log("checkToken -> true");
        resolve({
          resultStatus: consts.ResultStatus.ok,
        });
      } else {
        console.log("checkToken -> false");
        resolve({
          resultStatus: consts.ResultStatus.unauthorized,
          error: "unauthorized user"
        });
      }
    }).catch((err) => {
      const returnValue = {
        resultStatus: err.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
        error: err
      };
      console.log("checkToken -> error  -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(err));
      resolve(returnValue);
    });
  });
}


var saveToken = async function (userId, token) {
  console.log("saveToken -> {" + userId + ", " + token + "}");
  return new Promise(async function (resolve, reject) {
    await UserAuth.findOne({
      where: { user_id: userId }
    }).then(async (findedUserResult) => {
      if (findedUserResult == undefined) {
        const parms = {
          user_id: userId,
          token: token,
        };
        await UserAuth.create(parms).then((createdUserResult) => {
          const returnValue = {
            resultStatus: consts.ResultStatus.ok,
            result: functionsUtils.toPlain(createdUserResult)
          };
          console.log("saveToken -> done -> " + JSON.stringify(returnValue));
          resolve(returnValue);
        }).catch((createdError) => {
          const returnValue = {
            resultStatus: createdError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
            error: createdError
          };
          console.log("saveToken -> create  -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(createdError));
          resolve(returnValue);
        });
      } else {
        const parms = {
          token: token,
        };
        await UserAuth.update(parms, {
          where: { user_id: userId }
        }).then(async (updatedUserResult) => {
          const updatedRow = await UserAuth.findOne({ where: { user_id: userId } });
          const returnValue = {
            resultStatus: consts.ResultStatus.ok,
            result: updatedRow == undefined ? undefined : functionsUtils.toPlain(updatedRow)
          };
          console.log("saveToken -> done -> " + JSON.stringify(returnValue));
          resolve(returnValue);
        }).catch((updatedError) => {
          const returnValue = {
            resultStatus: updatedError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
            error: updatedError
          };
          console.log("saveToken -> update -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(updatedError));
          resolve(returnValue);
        });
      }
    }).catch((findedError) => {
      const returnValue = {
        resultStatus: findedError.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
        error: findedError
      };
      console.log("saveToken -> findOne  -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(findedError));
      resolve(returnValue);
    });
  });
}



const getAuthToken = (req, res, next) => {
  console.log("getAuthToken ->  " + JSON.stringify(req.body));
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.token = req.headers.authorization.split(' ')[1];
  } else {
    req.token = null;
  }
  next();
};


const checkIfAuthenticated = async (req, res, next) => {
  console.log("checkIfAuthenticated ->  " + JSON.stringify(req.body));
  await getAuthToken(req, res, async () => {
    if (req.token == undefined) {
      console.log({
        resultStatus: consts.ResultStatus.noTokenProvided,
        error: "No token provided"
      });
      return res.status(consts.ResultStatus.noTokenProvided).json({
        resultStatus: consts.ResultStatus.noTokenProvided,
        error: "No token provided"
      });
    } else {
      jwt.verify(req.token, consts.jwtSecrtKey, async function (err, decoded) {
        if (!err) {
          const result = await checkToken(req.token);
          if (result.resultStatus != consts.ResultStatus.ok) {
            res.status(result.resultStatus).json({
              resultStatus: result.resultStatus,
              error: result.error
            });
          } else {
            req.body['user'] = await decodeToken(req.token);
            next();
          }
        } else {
          res.status(consts.ResultStatus.unauthorized).json({
            resultStatus: consts.ResultStatus.unauthorized,
            error: "unauthorized user"
          });
        }
      });
    }
  });
};


module.exports = {
  getAuthToken,
  checkIfAuthenticated,
  saveToken,
  checkToken,
  decodeToken
};
