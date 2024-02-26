const SocketEvents = require("./socket_events");
const SocketRooms = require("./socket_rooms");
const SocketUtils = require("./socket_functions_utils");
const consts = require('../../env/env_consts');
const functionsUtils = require("../function_utils");
const user = require("../../models/user");
const auth = require("../../middlewares/auth_middleware");
const Joi = require("joi");


var init = async function (socket, userToken) {
  return new Promise(async function (resolve, reject) {
    var user = await auth.decodeToken(userToken);
    if (!user) {
      return resolve(false);
    }

    var room;

    switch (user.role) {
      case consts.UserRoles.employee:
        room = SocketRooms.users;
        break;
      case consts.UserRoles.manager:
        room = SocketRooms.managers;
        break;
    }

    const returnValue = await SocketUtils.saveUserSocketId(user.id, room, socket.id);

    if (returnValue.resultStatus == consts.ResultStatus.ok) {

      switch (room) {
        case SocketRooms.managers:
          console.log('added to managers Room');
          socket.join(SocketRooms.managers);
          break;
        case SocketRooms.users:
          console.log('added to users Room');
          socket.join(SocketRooms.users);
          break;
      }

      socket.emit(SocketEvents.onInit, "init done:=>" + JSON.stringify(user));
      resolve(true);
    } else {
      socket.removeAllListeners();
      console.log("init socket error : socket not saved!");
      resolve(false);
    }
  });
}

var onDisconnectBeforeInit = async function (socket) {
  console.log("onDisconnectBeforeInit");
  socket.removeAllListeners();
}

var onDisconnectAfterInti = async function (socket, userToken) {
  console.log('onDisconnectAfterInti ' + socket.id);

  var user = await auth.decodeToken(userToken);

  if (!user) {
    return false;
  }




  const userId = user.id;

  


  var room;

  switch (user.role) {
    case consts.UserRoles.employee:
      room = SocketRooms.users;
      break;
    case consts.UserRoles.manager:
      room = SocketRooms.managers;
      break;
  }



  socket.removeAllListeners();
  switch (room) {
    case SocketRooms.managers:
      console.log('manager deleted from room');
      socket.leave(SocketRooms.managers);
      break;
    case SocketRooms.users:
      console.log('user deleted from room');
      socket.leave(SocketRooms.users);
      break;
  }
  const returnValue = await SocketUtils.disconnectUserSocket(userId);
  console.log("disconnectUserSocket -> " + JSON.stringify(returnValue));
}

var onUserLocationChanged = async function (userId, lat, lng, angle) {
  return new Promise(async function (resolve, reject) {
    try {
      const socketIO = require("./socket_server").getio();
      socketIO.in(SocketRooms.managers).emit(SocketEvents.onUserLocationChanged, { user_id: userId, lat: lat, lng: lng, angle: angle });
      console.log("sent in SocketRooms.managers -> " + JSON.stringify({ user_id: userId, lat: lat, lng: lng, angle: angle }));
      return resolve({ resultStatus: consts.ResultStatus.ok });
    } catch (ex) {
      return resolve({ resultStatus: consts.ResultStatus.notOk });
    }
  });
}

module.exports = {
  init,
  onDisconnectBeforeInit,
  onDisconnectAfterInti,
  onUserLocationChanged,
}