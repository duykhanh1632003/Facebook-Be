const { verifyToken, createTokenPair } = require("../auth/authUtils");
const {
  RefreshTokenError,
  BadRequestError,
  AuthFailError,
} = require("../core/error.response");
const bcrypt = require("bcrypt");
const { keyToken } = require("../models/keyToken.model");
const { user } = require("../models/user.model");
const { findByEmail } = require("./user.service");
const crypto = require("crypto");
const { getInfoData } = require("../utils");
const KeyTokenService = require("./keyToken.service");

class AccessService {
  static refreshAccessToken = async (refreshToken) => {
    const holderUser = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderUser) throw new BadRequestError("Invalid refresh token");

    try {
      const { userId, email } = verifyToken(
        refreshToken,
        holderUser.privateKey
      );
      const tokens = await createTokenPair(
        { userId, email },
        holderUser.publicKey,
        holderUser.privateKey
      );

      return { tokens: { accessToken: tokens.accessToken } };
    } catch (err) {
      throw new RefreshTokenError("Refresh token expired");
    }
  };
  static handlerRefreshToken = async (refreshToken) => {
    // Tìm ra refreshToken được sử dụng hay chưa
    const foundToken = await KeyTokenService.foundByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = await verifyToken(
        refreshToken,
        foundToken.privateKey
      );
      await KeyTokenService.deleteKeyById(userId);
      throw new RefreshTokenError("Phiên đăng nhập của bạn đã hết hạn");
    }

    // Nếu chưa thì tiếp tục xác thực
    const holderUser = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderUser) throw new BadRequestError("User này chưa được đăng ký 1");
    const { userId, email } = verifyToken(refreshToken, holderShop.privateKey);
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("User này chưa được đăng ký 2");

    const tokens = await createTokenPair(
      { userId, email },
      holderUser.publicKey,
      holderUser.privateKey
    );
    await keyToken.updateOne(
      { _id: holderShop._id },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );

    return { user: { userId, email }, tokens };
  };

  static signUp = async ({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
  }) => {
    try {
      const holderUser = await user.findOne({ email }).lean();
      if (holderUser) {
        throw new BadRequestError("User already registered");
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = user.create({
        firstName,
        lastName,
        email,
        password: passwordHash,
        phoneNumber,
        gender,
      });

      return newUser;
    } catch (e) {
      throw new AuthFailError("Cannot create account");
    }
  };
  static logout = async (keystore) => {
    const deleteKey = await KeyTokenService.removeKeyById(keystore._id);
    return deleteKey;
  };
  static login = async ({ email, password, refreshToken = null }) => {
    const foundUser = await findByEmail({ email });
    if (!foundUser) {
      throw BadRequestError("Shop not registered");
    }
    console.log("check found", foundUser);
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new AuthFailError("Password Incorrect");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundUser._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: foundUser._id,
    });
    return {
      user: getInfoData({
        fields: ["_id", "name", "email", "avatar", "firstName", "lastName"],
        object: foundUser,
      }),
      tokens,
    };
  };
}

module.exports = AccessService;
