const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');

exports.postAdminLogin = async function postAdminLogin(req, res) {
  const { userMail, userPassword } = req.body;
  if (!('userMail' in req.body) && !('userPassword' in req.body)) {
    const error = new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', 'Mail and Password fields must be filled');
    const errorRespone = Response.errorRespone(error);
    return res.status(errorRespone.code).json({ errorRespone });
  }

  return UserModel.findOne({ userMail, userIsAdmin: true })
    .then(async (user) => {
      if (!user) {
        const error = new CustomError(Enum.HTTP_CODES.NOT_FOUND, 'Not Found', 'Users Not Found');
        const errorRespone = Response.errorRespone(error);
        return res.status(errorRespone.code).json({ errorRespone });
      }
      if (!user.userIsActive) {
        const error = new CustomError(Enum.HTTP_CODES.NOT_FOUND, 'Inactive', 'Users account is closed');
        const errorRespone = Response.errorRespone(error);
        return res.status(errorRespone.code).json({ errorRespone });
      }

      const hashedPassword = await bcrypt.compare(userPassword, user.userPassword);
      if (!hashedPassword) {
        const error = new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, 'Unauthorized', 'Invalid credentials');
        const errorRespone = Response.errorRespone(error);
        return res.status(errorRespone.code).json({ errorRespone });
      }

      return UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { userLastAccessTime: new Date(Date.now() + (3 * 60 * 60 * 1000)) } },
        { new: true },
      )
        .then((response) => {
          const token = user.createAuthToken();
          delete response.userPassword;
          return res.status(Enum.HTTP_CODES.OK).json(
            Response.successLoginResponse(response, token),
          );
        })
        .catch((error) => {
          const errorRespone = Response.errorRespone(error);
          return res.status(errorRespone.code).json(errorRespone);
        });
    })
    .catch((error) => {
      const errorRespone = Response.errorRespone(error);
      return res.status(errorRespone.code).json(errorRespone);
    });
};

exports.postAdminExit = async function postAdminExit(req, res) {
  try {
    return res.status(Enum.HTTP_CODES.OK).json(Response.successResponse('true', true, 'Logout Successful'));
  } catch (error) {
    const errorRespone = Response.errorRespone(error);
    return res.status(errorRespone.code).json(errorRespone);
  }
};

exports.getAllUsers = async function getAllUsers(req, res) {
  if (!('page' in req.params)) {
    const error = new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', 'page field must be filled');
    const errorRespone = Response.errorRespone(error);
    return res.status(errorRespone.code).json({ errorRespone });
  }
  let page = req.params.page * 10;
  if (page < 0) page = 0;

  return UserModel.find().select('-userPassword').limit(20).skip(page)
    .then((users) => {
      if (!users) {
        const error = new CustomError(Enum.HTTP_CODES.NOT_FOUND, 'Not Found', 'Users Not Found');
        const errorRespone = Response.errorRespone(error);
        return res.status(errorRespone.code).json({ errorRespone });
      }
      return res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(users));
    })
    .catch((error) => {
      const errorRespone = Response.errorRespone(error);
      return res.status(errorRespone.code).json(errorRespone);
    });
};

exports.getUserByUserId = async function getUserByUserId(req, res) {
  if (!('userId' in req.params)) {
    const error = new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', 'page field must be filled');
    const errorRespone = Response.errorRespone(error);
    return res.status(errorRespone.code).json({ errorRespone });
  }

  return UserModel.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        const error = new CustomError(Enum.HTTP_CODES.NOT_FOUND, 'Not Found', 'Users Not Found');
        const errorRespone = Response.errorRespone(error);
        return res.status(errorRespone.code).json({ errorRespone });
      }
      return res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(user));
    })
    .catch((error) => {
      const errorRespone = Response.errorRespone(error);
      return res.status(errorRespone.code).json(errorRespone);
    });
};

exports.putUserByUserId = async function putUserByUserId(req, res) {
  console.log('girdi');

  if (!('userId' in req.params)) {
    const error = new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', 'page field must be filled');
    const errorRespone = Response.errorRespone(error);
    return res.status(errorRespone.code).json({ errorRespone });
  }

  return UserModel.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        const error = new CustomError(Enum.HTTP_CODES.NOT_FOUND, 'Not Found', 'Users Not Found');
        const errorRespone = Response.errorRespone(error);
        return res.status(errorRespone.code).json({ errorRespone });
      }
      const bodyUser = new UserModel(req.body);
      console.log('bodyUser');

      return bodyUser.save()
        .then((response) => {
          if (response) {
            return res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(response));
          }

          const error = new CustomError(Enum.HTTP_CODES.NOT_FOUND, 'Not Found', 'Users Not Found');
          const errorRespone = Response.errorRespone(error);
          return res.status(errorRespone.code).json({ errorRespone });
        })
        .catch((error) => {
          const errorRespone = Response.errorRespone(error);
          return res.status(errorRespone.code).json(errorRespone);
        });
    })
    .catch((error) => {
      const errorRespone = Response.errorRespone(error);
      return res.status(errorRespone.code).json(errorRespone);
    });
};

// exports.getUserProccessByUserId = async function getUserProccessByUserId(req, res) {
//   const { userId } = req.params;
//   const userProccesses = await ProccessModel.find({ userId }).sort({ proccesTime: 1});
//   if (!userProccesses) return res.status(404).json({ msg: 'No User', status: false });
//   return res.status(200).json({ status: true, userProccesses });
// };

// exports.getUserProccessByProccessId = async function getUserProccessByProccessId(req, res) {

//     const {userId, proccessId} = req.params; 
//     const proccessesData = await ProccessModel.find({ userId: userId, _id: proccessId});
//     if(!proccessesData) 
//         return res.status(404).json({ msg: 'No Data. UserId Or ProccesId Wrong.', status: false });

//     return res.status(200).json({ status:true, proccessesData});
// };

// exports.deleteUserProccessByProccessId = async function deleteUserProccessByProccessId(req, res) {

//     const {userId, proccessId} = req.params; 
//     const proccessesData = await ProccessModel.findOneAndUpdate(
//         { userId: userId, _id: proccessId},
//         { $set: { proccessVisible: false } },
//         { new: true }, // Güncellenmiş kullanıcı bilgisini döndürmek için {new: true} kullanılabilir
//     );
//     if(!proccessesData) 
//         return res.status(404).json({ msg: 'No Data. UserId Or ProccesId Wrong.', status: false });

//     return res.status(200).json({ status:true, proccessesData});
// };

exports.deleteUserByUserId = async function deleteUserByUserId(req, res) {
  if (!('userId' in req.params)) {
    const error = new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', 'page field must be filled');
    const errorRespone = Response.errorRespone(error);
    return res.status(errorRespone.code).json({ errorRespone });
  }
  return UserModel.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: { userIsActive: false } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        const error = new CustomError(Enum.HTTP_CODES.NOT_FOUND, 'Not Found', 'Users Not Found');
        const errorRespone = Response.errorRespone(error);
        return res.status(errorRespone.code).json({ errorRespone });
      }
      return res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(user));
    })
    .catch((error) => {
      const errorRespone = Response.errorRespone(error);
      return res.status(errorRespone.code).json(errorRespone);
    });
};
