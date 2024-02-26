const consts = require('../../env/env_consts');
const sequelizeDb = require("../../dbs/sequelize_db");
const { Op } = require('sequelize');
const User = sequelizeDb.user;
const UserSocket = sequelizeDb.userSocket;
const UserLocation = sequelizeDb.userLocation;
const functionsUtils = require("../function_utils");
const Joi = require('joi');
const SocketRooms = require('./socket_rooms');
const SocketEvents = require('./socket_events');


var saveUserSocketId = async function (user_id, room, socket_id) {
  console.log("saveUserSocket -> {" + user_id + ", " + socket_id + "}");
  return new Promise(async function (resolve, reject) {

    const parms = {
      user_id: user_id,
      socket_id: socket_id,
      is_online: true,
      room: room
    };

    await UserSocket.upsert(parms, {
      where: { user_id: user_id }
    }).then(async (updatedUserResult) => {
      const returnValue = {
        resultStatus: consts.ResultStatus.ok,
      };
      console.log("saveUserSocketId -> done -> " + JSON.stringify(returnValue));
      resolve(returnValue);
    }).catch((err) => {
      returnValue = {
        resultStatus: err.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
        error: err
      };
      console.log("saveUserSocket -> UserSocket.findOne.error -> " + JSON.stringify(returnValue));
      resolve(returnValue);
    });
  });
}


var disconnectUserSocket = async function (userId) {
  console.log("disconnectUserSocket -> {" + userId + "}");
  return new Promise(async function (resolve, reject) {
    const parms = {
      is_online: false,
      socket_id: undefined,
    };
    await UserSocket.update(parms, {
      where: { user_id: userId }
    }).then(async (result) => {
      const returnValue = {
        resultStatus: consts.ResultStatus.ok,
      };
      console.log("disconnectUserSocket -> done -> " + JSON.stringify(returnValue));

      const socketIO = require("./socket_server").getio();
      socketIO.in(SocketRooms.managers).emit(SocketEvents.onUserLostConnection, { user_id: userId, });
      console.log("sent in SocketRooms.managers -> " + JSON.stringify({ user_id: userId }));

      resolve(returnValue);
    }).catch((error) => {
      const returnValue = {
        resultStatus: error.name == consts.ExeptionsCode.SequelizeConnectionError ? consts.ResultStatus.pressureOnServer : consts.ResultStatus.notOk,
        error: error
      };
      console.log("disconnectUserSocket -> findOne  -> error -> " + JSON.stringify(returnValue) + " ---" + JSON.stringify(error));
      resolve(returnValue);
    });
  });
}


module.exports = {
  saveUserSocketId,
  disconnectUserSocket,
}