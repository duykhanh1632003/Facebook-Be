const _ = require("lodash");
const { user } = require("../models/user.model");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getUserById = async (id) => {
  return await user
    .findOne({
      _id: id,
    })
    .select("id firstName lastName avatar")
    .lean()
    .exec();
};

module.exports = {
  getInfoData,
  getUserById,
};
