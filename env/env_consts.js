// const DB = {
//     host: "127.0.0.1",
//     user:"mysql_user",
//     password:"Mysql@123",
//     port: "3306",
//    database: "barcode",
// }

const DB = {
    host: "localhost",
  user: "root",
  port:8889,
  password: "root",
  database: "barcode",
}

const ResultStatus = {
    ok: 200,
    notOk: 500, 
    somethingWrong: 501,
    unauthorized: 401,
    accessDenied : 403,
    noTokenProvided: 404,
    pressureOnServer: 503,

};




const LangsCode = {
    en:"en",
    ar:"ar"
}



const UserColumns = {
    fcm_token:1,
    face_id:2,
    app_lng:3,
}


const ErrorsCode = {
    columnError: 1,
}


const UserRoles = {
    employee: "employee",
    manager: "manager",
}


const ExeptionsCode = {
    notAllowed:'NotAllowed',
    rownNotFound:'RowNotFound',
    notUpdated:'notUpdated',
    SequelizeConnectionError:"SequelizeConnectionError"
}


const NotivicationTypeCode = {
    newRequest:"new_request",
    newNote:"new_note",
    completionNote:"notice_of_completion",
}

const jwtSecrtKey = "barcode@jwt_key";

const saltCryptCode = 10;

module.exports = {
    DB,
    UserColumns,
    ResultStatus,
    ExeptionsCode,
    ErrorsCode,
    jwtSecrtKey,
    LangsCode,
    saltCryptCode,
    NotivicationTypeCode,
    UserRoles
} 