
// const admin = require('../dbs/firebase-db');
const consts = require('../env/env_consts');
const  admin = require('../dbs/firebase-db');
const pino = require('pino')
const pretty = require('pino-pretty')
const stream = pretty({
  colorize: true
})
const logger = pino(stream)

function generate(n) {
  var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
}

function releaseConnection(connection) {
  loggerInfo("releaseConnection . . .  .");
  try {
    connection.release();
  } catch (ex) {
    loggerInfo('has alrady release !');
  }
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function sleepThen(time, code) {
  return new Promise((resolve) => setTimeout(resolve, time)).then(code);
}


const toPlain = response => {
  try{
    if(!response){
      return undefined;
    }
    const flattenDataValues = ({ dataValues }) => {
      const flattenedObject = {};
  
      Object.keys(dataValues).forEach(key => {
        const dataValue = dataValues[key];
  
        if (
          Array.isArray(dataValue) &&
          dataValue[0] &&
          dataValue[0].dataValues &&
          typeof dataValue[0].dataValues === 'object'
        ) {
          flattenedObject[key] = dataValues[key].map(flattenDataValues);
        } else if (dataValue && dataValue.dataValues && typeof dataValue.dataValues === 'object') {
          flattenedObject[key] = flattenDataValues(dataValues[key]);
        } else {
          flattenedObject[key] = dataValues[key];
        }
      });
  
      return flattenedObject;
    };
  
    return Array.isArray(response) ? response.map(flattenDataValues) : flattenDataValues(response);
  }catch(ex){
    loggerInfo("Function Utils toPlain" + JSON.stringify(ex));
return undefined;
  }
};

/**
* @param {String} fcmToken
* @param {String} title
* @param {String} body
*/
const sendNotification = async (fcmToken, title, body) => {
  return new Promise(async function (resolve, reject) {

    if(!fcmToken){
      returnValue = {
        resultStatus:consts.ResultStatus.notOk,
        error:"fcmToken is null",
        message:"Error sending message:", error
      };
   return resolve(returnValue);
    }

    var options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    };

    var payload = {
      notification: {
        title: title,
        body: body
      },
    };

    await admin.messaging().sendToDevice(fcmToken, payload, options)
      .then(function (response) {
        returnValue = {
          resultStatus:consts.ResultStatus.ok,
          result:response,
          message:"Successfully sent message:", response
        };
      })
      .catch(function (error) {
        returnValue = {
          resultStatus:consts.ResultStatus.notOk,
          error:error,
          message:"Error sending message:", error
        };
      });
    loggerInfo(returnValue);
    resolve(returnValue);
  });

}

const loggerInfo = (message)=>{
  

  logger.info(message);
}


const loggerError = (message)=>{
  
  logger.error(message);
}

module.exports = {
  sendNotification,
  generate,
  releaseConnection,
  sleep,
  sleepThen,
  toPlain: toPlain,
  loggerError,
  loggerInfo
}