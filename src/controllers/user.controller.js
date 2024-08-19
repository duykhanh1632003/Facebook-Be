"use strict"

const {CREATED,SuccessResponse} = require("../core/success.response");
const {findUserById} = require("../services/user.service");

class UserController{
    handleGetUserById = async (req,res,next)=>{
        const data = await findUserById(req.params);
        new SuccessResponse(data).send(res);
    }
}

module.exports = new UserController();