"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const AttributesService = require("../services/attributes.service");

class AttributesController {
  createAttributes = async (req, res, next) => {
    const data = req.body;
    const response = await AttributesService.createAttributes({
      data,
      userId: req.user.userId,
    });
    new SuccessResponse({
      message: "Attributes created successfully",
      data: response,
    }).send(res);
  };

  getAttributes = async (req, res, next) => {
    const response = await AttributesService.getAttributes({
      userId: req.user.userId,
    });
    console.log("Check res", response);
    new SuccessResponse({
      message: "Get attributes successfully",
      metadata: response,
    }).send(res);
  };

  updateAttribute = async (req, res, next) => {
    const { attributeId } = req.params;
    const { newValue } = req.body;
    const response = await AttributesService.updateAttributes({
      userId: req.user.userId,
      attributeId,
      newValue,
    });
    new SuccessResponse({
      message: "Attribute updated successfully",
      data: response,
    }).send(res);
  };

  deleteAttribute = async (req, res, next) => {
    const { attributeId } = req.params;
    const response = await AttributesService.deleteAttribute({
      userId: req.user.userId,
      attributeId,
    });
    new SuccessResponse({
      message: "Attribute deleted successfully",
      data: response,
    }).send(res);
  };
}

module.exports = new AttributesController();
