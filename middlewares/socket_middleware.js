const consts = require('../env/env_consts');
var jwt = require('jsonwebtoken');
const sequelizeDb = require("../dbs/sequelize_db");
const functionsUtils = require("../utils/function_utils");
const auth = require('./auth_middleware');

const User = sequelizeDb.user;
const UserAuth = sequelizeDb.userAuth;
const UserSocket = sequelizeDb.userSocket;
const UserLocation = sequelizeDb.userLocation;


const getAuthToken = (socket) => {
 return socket.handshake.query.token;
};

const checkIfAuthenticated = async (socket, next) => {
  var token = getAuthToken(socket);
  if(!token){
    return next({
      resultStatus: consts.ResultStatus.noTokenProvided,
      error: "No token provided"
    });
   }

   jwt.verify(token, consts.jwtSecrtKey, async function (err, decoded) {
    if (!err) {
      const result = await auth.checkToken(token);
      if (result.resultStatus != consts.ResultStatus.ok) {
        next({
          resultStatus: result.resultStatus,
          error: result.error
        });
      } else {
        next();
      }
    } else {
      next({
        resultStatus: consts.ResultStatus.unauthorized,
        error: "unauthorized user"
      });
    }
  });


};


module.exports = {
  checkIfAuthenticated,
  getAuthToken
};
