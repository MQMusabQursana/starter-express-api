const { Sequelize ,QueryTypes} = require('sequelize');
const functionsUtils = require("../utils/function_utils");

const consts = require("../env/env_consts");


const sequelize = new Sequelize(consts.DB.database, consts.DB.user, consts.DB.password, {
  host: consts.DB.host,
  dialect: 'mysql',
  port:consts.DB.port,
  
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

sequelize.authenticate().then((result) => {
  functionsUtils.loggerInfo('Connection has been established successfully.');

}).catch((err) => {

  console.error('Unable to connect to the database: ', err);
});;

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.appVersion = require("../models/app_version")(sequelize);
db.user = require("../models/user")(sequelize);
db.userAuth = require("../models/user_auth")(sequelize);
db.userSocket = require("../models/user_socket")(sequelize);
db.userLocation = require("../models/user_location")(sequelize);
db.notivication = require("../models/notification")(sequelize);
db.userZone = require("../models/user_zone")(sequelize);




// user - user_auth relation 2 --------------
db.user.hasOne(db.userAuth, {
  foreignKey: {
    allowNull: false,
    name: "user_id"
  },
  as: "auth",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.userAuth.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "auth_user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.user.hasOne(db.userSocket, {
  foreignKey: {
    allowNull: false,
    name: "user_id"
  },
  as: "socket",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.userSocket.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "socket_user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.user.hasOne(db.userLocation, {
  foreignKey: {
    allowNull: false,
    name: "user_id"
  },
  as: "location",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.userLocation.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "location_user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
//------------------- - --------


// --------------
db.user.hasMany(db.notivication, {
  foreignKey: {
    allowNull: false,
    name: "push_for_user_id"
  },
  as: "notivications",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.notivication.belongsTo(db.user, {
  foreignKey: "push_for_user_id",
  as: "notivication_user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});


db.user.hasMany(db.userZone, {
  foreignKey: {
    allowNull: false,
    name: "user_id"
  },
  as: "zones",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.userZone.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "zone_user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});



//----------------------------



db.sequelize.sync({ force: false }).then(() => {
  functionsUtils.loggerInfo('Sequelize DB re sync done');
});


module.exports = db;