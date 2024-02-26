
const SocketEvents = require("./socket_events");
const SocketRooms = require("./socket_rooms");
const SocketListeners = require("./socket_listeners");
const SocketUtils = require("./socket_functions_utils");
const SocketDataValidator = require("./socket_data_validator");
const AuthMiddleware = require("../../middlewares/auth_middleware");
const SocketMiddleware = require("../../middlewares/socket_middleware");
const { Server } = require("socket.io");
const  sequelizeDb = require("../../dbs/sequelize_db");
const UserSocket = sequelizeDb.userSocket;
let socketIO;

async function init(server) {
  console.log('#################################BARCODE SOKET IO############################################');

  //must online all socket when server restarted;
 await UserSocket.update({is_online:false},{where:{}}).catch((ex)=>{});

  socketIO = new Server(server);

  socketIO.use((socket, next) => {
    SocketMiddleware.checkIfAuthenticated(socket, next);

  }).on(SocketEvents.connection, (socket) => {
    console.log("##########################################");
    console.log("SocketEvent: " + SocketEvents.connection);
    console.log("##########################################");


    socket.on(SocketEvents.disconnect, (data) => {
      console.log("##########################################");
      console.log("SocketEvent: " + SocketEvents.disconnect);
      console.log("##########################################");

      SocketListeners.onDisconnectBeforeInit(socket);
    });



    console.log("##########################################");
    console.log("SocketEvent: " + SocketEvents.init);
    console.log("##########################################");

    var socketToken = SocketMiddleware.getAuthToken(socket);

    var checkIsInit = SocketListeners.init(socket, socketToken);

    if (checkIsInit) {
      console.log("init done");

      socket.on(SocketEvents.disconnect, (data) => {
        console.log("##########################################");
        console.log("SocketEvent: " + SocketEvents.disconnect);
        console.log("##########################################");

        SocketListeners.onDisconnectAfterInti(socket, socketToken);
      });

      socket.on(SocketEvents.onUserLocationChanged, (data) => {
        console.log("##########################################");
        console.log("SocketEvent: " + SocketEvents.onUserLocationChanged);
        console.log("##########################################");



        SocketMiddleware.checkIfAuthenticated(socket, (error) => {
          if (!error) {
            var checkOnUserLocationChanged = SocketDataValidator.checkOnUserLocationChanged(data);

            if (checkOnUserLocationChanged) {
              SocketListeners.onUserLocationChanged(data.user_id, data.lat, data.lng, data.angle);
            }
          } else {
            SocketListeners.onDisconnectAfterInti(socket, socketToken);
          }
        });

      });
    } else {
      console.log("init error");
    }
  });


  return socketIO;
}

function getio() {
  // return previously cached value
  if (!socketIO) {
    console.log('#############################################################################');
    throw new Error("must call .init(server) before you can call .getio()");
  }
  return socketIO;
}

module.exports = {
  init,
  getio,
}