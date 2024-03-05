const DB = {
    host: "localhost",
    user:"admin",
    password:"admin",
    port: "3306",
   database: "barcode",
}

// const DB = {
//     host: "aaivanov.000webhostapp.com",
//   user: "id21960457_123user",
//   port:3306,
//   password: "123Abc-db",
//   database: "id21960457_mqtc",
// }

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