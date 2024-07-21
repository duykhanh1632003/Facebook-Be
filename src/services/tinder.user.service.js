const { userTiner } = require("../models/tinder/user.tinder.model");

class TinderService {
  createUserTinder = async (userData) => {
    const userProfile = await userTiner.create(userData);
    return userProfile;
  };
}

module.exports = new TinderService();
