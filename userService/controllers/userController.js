const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const StoryModel = require('../models/storyModel');
const postRabbitMqHelper = require('../helper/postRabbitMq');
// const getCurrentDate = require('../helper/getCurrentDate');

exports.postCreateUser = async function postCreateUser(req, res) {
  const {
    userMail, userPassword, userName, userNickName, userColor, userGender,
  } = req.body;
  let checkUser;
  await UserModel.findOne({ $or: [{ userNickName }, { userMail }] })
    .then((res) => {
      if (res && res.userMail === userMail) return res.status(400).json({ msg: 'Email already used', status: false, body: req.body });

      if (res && res.userNickName === userNickName) return res.status(400).json({ msg: 'Nickname already used', status: false, body: req.body });
      checkUser = res;
    })
    .catch((error) => res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false }));

  const istanbulTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' });
  const istanbulDate = new Date(istanbulTime);
  istanbulDate.setHours(istanbulDate.getHours() + 3);

  let IsAdmin = false;
  await UserModel.countDocuments({ userIsActive: true })
    .then((res) => {
      res === 0 ? IsAdmin = true : IsAdmin = false;
    })
    .catch((error) => res.status(500).json({ msg: `Server Error -- ${error.message}`, status: false }));

  const hashedPassword = await bcrypt.hash(userPassword, 10);
  checkUser = new UserModel({
    userActive: 1,
    userIsAdmin: IsAdmin,
    userMail,
    userPassword: hashedPassword,
    userName,
    userNickName,
    userColor,
    userGender,
    userLocation: {
      locationCountry: 'Türkiye',
      locationPostCode: 0,
      locationAddress: 'Ankara',
    },
    userCreatedAt: istanbulDate,
    userLastAccessTime: istanbulDate,
  });

  await checkUser.save()
    .then((response) => {
      delete checkUser.userPassword;
      delete response.userPassword;
      return res.status(200).json({ status: true, checkUser });
    })
    .catch((error) => {
      delete checkUser.userPassword;
      return res.status(500).json({ msg: `Kayıt Başarısız -- ${error.message}`, checkUser, status: false });
    });
};

exports.postLoginUser = async function postLoginUser(req, res) {
  const { userMail, userPassword } = req.body;
  let user = await UserModel.findOne({ userMail });
  if (!user) return res.json({ msg: 'Incorrect Mail', status: false });

  const hashedPassword = await bcrypt.compare(userPassword, user.userPassword);
  if (!hashedPassword) return res.json({ msg: 'Incorrect Username or Password', status: false });

  if (user.userActive) return res.json({ msg: 'the account is passive', status: false });

  const istanbulTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' });
  const istanbulDate = new Date(istanbulTime);
  istanbulDate.setHours(istanbulDate.getHours() + 3);

  user = await UserModel.findOneAndUpdate(
    { _id: user._id },
    { $set: { userLastAccessTime: istanbulDate } },
    { new: true }, // Güncellenmiş kullanıcı bilgisini döndürmek için {new: true} kullanılabilir
  );
  if (user) {
    const token = user.createAuthToken();
    delete user.userPassword;
    return res.status(200).json({ status: true, user, X_Access_Token: token });
  }

  delete user.userPassword;
  return res.json({ status: false, user });
};

exports.getExitUser = async function getExitUser(req, res) {
  try {
    if (!req.params.id) return res.json({ msg: 'User id is required ', status: true });
    return res.status(200).send();
  } catch (ex) {
    return res.status(500).json({ msg: `Server Error ${ex.message}`, status: false });
  }
};

exports.postChangePasswordUser = async function postChangePasswordUser(req, res) {
  const { userPassword} = req.body;
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  await UserModel.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: { userPassword: hashedPassword } },
    { new: true },
  )
    .then((user) => {
      delete user.userPassword;
      return res.json({ status: true, user });
    })
    .catch((error) => res.status(500).json({ msg: `Kullanıcı Bulunamadı -- ${error.message}`, status: false }));
};

exports.postChangePasswordUser = async function postChangePasswordUser(req, res) {
  const { userPassword } = req.body;
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  await UserModel.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: { userPassword: hashedPassword } },
    { new: true },
  )
    .then((user) => {
      delete user.userPassword;
      return res.json({ status: true, user });
    })
    .catch((error) => res.status(500).json({ msg: `Kullanıcı Bulunamadı -- ${error.message}`, status: false }));
};

exports.postForgotPassword = async function postForgotPassword(req, res) {
  const { userMail } = req.body;
  const jwtRefreshToken = jwt.sign(
    {},
    'privateappkey',
    { expiresIn: '1h' },
  );

  await UserModel.findOneAndUpdate(
    { userMail },
    {
      $set: {
        hasRefreshPassword: true,
        refreshPasswordToken: jwtRefreshToken,
      },
    },
    { new: true },
  ).select(['hasRefreshPassword'])
    .then((response) => {
      if (response) {
        const rabbitProducer = postRabbitMqHelper(userMail, jwtRefreshToken, response._id);
        if (rabbitProducer) {
          return res.status(200).json({ msg: 'Mail Yollandı', status: true });
        }
        return res.status(500).json({ msg: 'Internal Server Error', status: false });
      }
      return res.status(404).json({ msg: 'Kullanıcı Bulunamadı', status: false });
    })
    .catch((error) => res.status(500).json({ msg: `Internal Server Error -- ${error.message}`, status: false }));
};

exports.postHasRefreshPassword = async function postHasRefreshPassword(req, res) {
  const { refreshToken, userId } = req.params;
  await UserModel.findOne({ _id: userId }).select(['hasRefreshPassword', 'refreshPasswordToken'])
    .then((response) => {
      if (response) {
        if (response.hasRefreshPassword === true) {
          if (response.refreshPasswordToken === refreshToken) return res.status(200).json({ msg: 'Password Page True', status: true });
          return res.status(401).json({ msg: 'Link Yanlış. Mailinizdeki Linki Tarayıcınızda Açın.', status: false });
        }
        return res.status(404).json({ msg: 'Kullanıcının Password Refresh Talebi Olmamıştır', status: false });
      }
      return res.status(404).json({ msg: 'Kullanıcı Bulunamadı', status: false });
    })
    .catch((error) => res.status(500).json({ msg: `Internal Server Error -- ${error.message}`, status: false }));
};

exports.postRefreshPassword = async function postRefreshPassword(req, res) {
  const { refreshToken, userId } = req.params;
  const { newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await UserModel.findOne({ _id: userId })
    .then(async (response) => {
      if (response) {
        if (response.refreshPasswordToken !== refreshToken) return res.status(401).json({ msg: 'Link Yanlış. Mailinizdeki Linki Tarayıcınızda Açın.', status: false });

        response.refreshPasswordToken = '';
        response.hasRefreshPassword = false;
        response.userPassword = hashedPassword;
        await response.save();
        return res.status(200).json({ msg: 'Şifreniz Başarıyla Değiştirildi', status: true });
      } return res.status(404).json({ msg: 'Kullanıcı Bulunamadı', status: false });
    })
    .catch((error) => res.status(500).json({ msg: `Internal Server Error -- ${error.message}`, status: false }));
};

exports.postChangeMailUser = async function postChangeMailUser(req, res) {
  const { userMail, newMail } = req.body;
  await UserModel.findOneAndUpdate(
    { userMail },
    { $set: { userMail: newMail } },
    { new: true },
  )
    .then((user) => {
      delete user.userPassword;
      return res.json({ status: true, user });
    })
    .catch((error) => res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false }));
};

module.exports.getAllUsers = async function getAllUsers(req, res) {
  await UserModel.find({ _id: { $ne: req.params.id } }).select([
    'userMail',
    'userNickName',
    'avatarImage',
    'hasStory',
    '_id',
  ])
    .then((response) => res.status(200).json({ response, status: true }))
    .catch((error) => res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false }));
};

module.exports.setAvatar = async function setAvatar(req, res) {
  const userId = req.params.id;
  const { avatarImage } = req.body;
  await UserModel.findByIdAndUpdate(
    { _id: userId },
    { $set: { isAvatarImageSet: true, avatarImage } },
    { new: true },
  )
    .then((response) => res.status(200).json({ status: true, response }))
    .catch((error) => res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false }));
};

module.exports.getStories = async function getStories(req, res) {
  await UserModel.find({ hasStory: true }).select([
    'avatarImage',
    'userNickName',
    '_id',
    'hasStory',
  ])
    .then((response) => {
      if (response.length > 0) return res.status(200).json({ response, status: true });
      return res.status(200).json({ msg: 'Kullanıcı Bir Story\'e Sahip Değil', status: true });
    })
    .catch((error) => res.status(500).json({ msg: `Server Error -- ${error.message}`, status: false }));
};

module.exports.getStoryByUserId = async function getStoryByUserId(req, res) {
  await StoryModel.find({ senderUserId: req.params.userId }).select([
    '_id',
    'senderUserId',
    'senderUserAvatarImage',
    'senderUserNickName',
    'storyPath',
    'duration',
    'createdAt',
    'isActive',
  ])
    .then((response) => {
      if (response.length === 0) return res.status(404).json({ msg: 'Kullanıcı Bir Story`ye Sahip Değil.', status: true });
      console.log(response);
      return res.status(200).json({ response, status: true });
    })
    .catch((error) => res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false }));
};

module.exports.deleteStoryByStoryId = async function deleteStoryByStoryId(req, res) {
  await StoryModel.findOneAndDelete({ _id: req.params.storyId })
    .then(async (response) => {
      if (response.length === 0) {
        return res.status(404).json({ msg: 'Story Bulunamadı.', response, status: true });
      }
      return res.status(200).json({ msg: 'Başarıyla Silindi', status: true });
    })
    .catch((error) => res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false }));
};

module.exports.getUserByUserId = async function getUserByUserId(req, res) {
  await UserModel.find({ _id: req.params.userId }).select([
    'userMail',
    'userName',
    'userNickName',
    'userColor',
    'userGender',
    'userCreatedAt',
    'userLastAccessTime',
    'isAvatarImageSet',
    'avatarImage',
  ])
    .then((response) => res.status(200).json({ response, status: true }))
    .catch((error) => res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false }));
};

module.exports.putUserByUserId = async function putUserByUserId(req, res) {
  const { standartValues } = req.body;
  await UserModel.findByIdAndUpdate(
    req.params.userId,
    { $set: standartValues },
    { new: true },
  )
    .then((response) => res.status(200).json({ response, status: true }))
    .catch((error) => res.status(404).json({ msg: `Kayıt Bulunamadı -- ${error}`, status: false }));
};

module.exports.putUserPasswordByUserId = async function putUserPasswordByUserId(req, res) {
  const { oldUserPassword, newUserPassword } = req.body;
  const newHashedPassword = await bcrypt.hash(newUserPassword, 10);
  await UserModel.find({ _id: req.params.userId }).select(['userPassword'])
    .then(async (respon) => {
      const hashedPassword = await bcrypt.compare(oldUserPassword, respon[0].userPassword);
      if (!hashedPassword) return res.status(200).json({ msg: 'Mevcut Şifreniz Doğru Değil', status: false });
      await UserModel.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { userPassword: newHashedPassword } },
        { new: true },
      )
        .then((response) => res.status(200).json({ response, status: true }))
        .catch((error) => res.status(404).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false }));
    })
    .catch((error) => res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false }));
};

module.exports.postStoryById = async function postStoryById(req, res) {
  await UserModel.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: { hasStory: true } },
    { new: false },
  )
    .then((response) => {
      response ? delete response.userPassword : null;
    })
    .catch((error) => res.status(404).json({ status: false, msg: `Kayıt Başarısız -- ${error.message}` }));
  const Story = new StoryModel({
    senderUserId: req.params.userId,
    senderUserAvatarImage: req.body.senderUserAvatarImage,
    senderUserNickName: req.body.senderUserNickName,
    duration: req.body.duration,
    storyPath: req.file.path,
    size: req.file.size,
  });
  await Story.save()
    .then((response) => res.status(200).json({ status: true, response }))
    .catch((error) => res.status(500).json({ status: false, msg: `Kayıt Başarısız -- ${error.message}` }));
};
