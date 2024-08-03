"use strict";
const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Key Forbidden error",
      });
    }
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "objKey Forbidden error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error",e
    });
  }
};

const permission = (permissionCode) => {
  return (req, res, next) => {
    console.log("check object key", req.objKey.permissions);

    if (!req.objKey || !req.objKey.permissions) {
      // Kiểm tra req.objKey tồn tại và có thuộc tính permissions
      return res.status(403).json({
        message: " objKey Permission denied",
      });
    }

    const validPermission = req.objKey.permissions.includes(permissionCode); // Sửa includes thành includes
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    return next();
  };
};

module.exports = { apiKey, permission };
