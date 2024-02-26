const SocketEvents = require("./socket_events");
const SocketRooms = require("./socket_rooms");
const SocketUtils = require("./socket_functions_utils");
const consts = require('../../env/env_consts');
const functionsUtils = require("../function_utils");
const user = require("../../models/user");
const Joi = require("joi");


  var checkOnUserLocationChanged = function(data){
    const schema = Joi.object({
      user_id: Joi.string().required(),
      lat: Joi.number().required(),
      lng: Joi.number().required(),
      angle: Joi.number().required(),
    });
  
    const { error } = schema.validate(data);
  
    if (error) {
      const returnValue = {
        resultStatus: consts.ResultStatus.notOk,
        error: error.details[0].message.toString()
      };
      functionsUtils.loggerInfo("checkOnUserLocationChanged error  -> " + JSON.stringify(returnValue));
      return false;
    }
    return true;
  }

module.exports = {
    checkOnUserLocationChanged
};