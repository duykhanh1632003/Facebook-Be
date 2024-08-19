"use strict";
const { default: mongoose } = require("mongoose");
const { user } = require("../models/user.model");

const findByPhoneNumber = async ({
  phoneNumber,
  select = { firstName: 1, lastName: 1, email: 1, gender: 1 },
}) => {
  return await user.findOne({ phoneNumber: phoneNumber }).select(select).lean();
};

const findByEmail = async ({
  email,
  select = {
    firstName: 1,
    lastName: 1,
    password: 1,
    email: 1,
    phoneNumber: 1,
    avatar: 1,
  },
}) => {
  return await user.findOne({ email: email }).select(select).lean();
};

const findUserById = async ({
  userId,
})=>{
  try{
    const searchedUser = await user.find({_id: new mongoose.Types.ObjectId(userId)});
    console.log("Completed find User!");
    if(!searchedUser){
      return {
        code:"404",
        message:"Not found userId",
      }
    };
    return {
      code:"200",
      message:"Search user successfully!",
      metadata:searchedUser,
    }
  }catch(error){
    return{
      code:'500',
      error,
    }
  }
}
module.exports = {
  findByEmail,
  findByPhoneNumber,
  findUserById
};
