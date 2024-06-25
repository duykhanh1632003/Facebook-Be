"use strict";

const { ReasonCode, StatusCodes } = require("../utils/httpStatusCode");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonCode.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonCode.BAD_REQUEST,
    status = StatusCodes.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class AuthFailError extends ErrorResponse {
  constructor(
    message = ReasonCode.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonCode.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
    super(message, status);
  }
}
class RefreshTokenError extends ErrorResponse {
  constructor(message = ReasonCode.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
    super(message, status);
  }
}
module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailError,
  NotFoundError,
  RefreshTokenError,
};
