"use strict";
const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { NotFoundError, AuthFailError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESHTOKEN: "refreshToken",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, { expiresIn: "7d" });
    const refreshToken = jwt.sign(payload, privateKey, { expiresIn: "7d" });

    return { accessToken, refreshToken };
  } catch (e) {
    console.error("Error creating token pair:", e);
    throw e;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new NotFoundError("Invalid request: userId missing");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("KeyStore not found");

  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  if (refreshToken) {
    try {
      const decodedUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodedUser.userId)
        throw new NotFoundError("Invalid user");

      req.keyStore = keyStore;
      req.user = decodedUser;
      req.refreshToken = refreshToken;
    } catch (error) {
      console.error("Error verifying refresh token:", error);
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new NotFoundError("Access token not found");

  try {
    const decodedUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodedUser.userId) throw new AuthFailError("Invalid user");

    req.userId = keyStore.userId;
    req.keyStore = keyStore;
    req.user = decodedUser;
    return next();
  } catch (error) {
    console.error("Error verifying access token:", error);
    throw error;
  }
});

const verifyToken = (token, keySecret) => {
  try {
    return jwt.verify(token, keySecret);
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

module.exports = {
  createTokenPair,
  verifyToken,
  authentication,
};
