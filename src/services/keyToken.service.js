"use strict";

const mongoose = require("mongoose");
const { keyToken } = require("../models/keyToken.model");
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
      const tokens = await keyToken.findByIdAndUpdate(
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
    return await keyToken
      .findOne({ user: new mongoose.Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyToken.deleteOne(id);
  };

  static foundByRefreshTokenUsed = async (refreshToken) => {
    return await keyToken.findOne({
      refreshTokenUsed: refreshToken,
    });
  };
  static deleteKeyById = async (userId) => {
    return await keyToken.deleteOne({ user: userId });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyToken.findOne({ refreshToken }).lean();
  };
}

module.exports = KeyTokenService;
