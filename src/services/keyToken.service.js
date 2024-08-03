"use strict";
const keyTokenModel = require("../models/keyToken.model");
const mongoose = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? publicKeyString : null;
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (e) {
      return e;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel
      .findOne({ user: new mongoose.Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };

  static foundByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({
      refreshTokenUsed: refreshToken,
    });
  };
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };
}

module.exports = KeyTokenService;
