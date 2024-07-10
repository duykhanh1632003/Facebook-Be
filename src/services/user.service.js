"use strict";

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

module.exports = {
  findByEmail,
  findByPhoneNumber,
};
