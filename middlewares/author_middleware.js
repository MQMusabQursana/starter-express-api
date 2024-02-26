var consts = require("../env/env_consts");


const OnlyManager =  (req, res) => {
    const role = req.body.user.role;
    if (role != consts.UserRoles.manager) {
        return {
            resultStatus: consts.ResultStatus.accessDenied,
            error: "Acces Denied"
        }
    }else{
     return   {
            resultStatus: consts.ResultStatus.ok,
        }
    }
}

module.exports = {
    OnlyManager,
   
}