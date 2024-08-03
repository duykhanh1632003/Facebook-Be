const {  SuccessResponse } = require("../core/success.response");
const TinderService = require("../services/tinder.user.service");

class TinderController {
  createUserTinder = async (req, res) => {
    const data = await TinderService.createUserTinder(req.body);
    new SuccessResponse({
      message: "User profile created successfully",
      metadata: data,
    }).send(res);
  };
}

module.exports = new TinderController();
