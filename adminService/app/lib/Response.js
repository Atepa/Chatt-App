const Enum = require('../config/Enum');
const CustomError = require('./Error');

class Response {
  constructor() { }

  static successResponse(data, status = true, msg = 'true') {
    return {
      data,
      status,
      msg,
    };
  }

  static successLoginResponse(data, XAccessAdminToken, status = true, msg = 'true') {
    return {
      data,
      XAccessAdminToken,
      status,
      msg,
    };
  }

  static errorRespone(error, msg) {
    if (error instanceof CustomError) {
      return {
        code: error.code,
        error: {
          message: error.message,
          msg: !msg,
          description: error.description,
        },
      };
    }
    return {
      code: Enum.HTTP_CODES.INT_SERVER_ERROR,
      error: {
        msg: 'Unknown Error!',
        description: error.message,
      },
    };
  }
}

module.exports = Response;
