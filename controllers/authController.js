const usersModel = require('../models/userModel');
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
//const getCurrentDate = require('../helper/getCurrentDate');

exports.postCreateUser = async function postCreateUser(req, res) {

    const {userMail, userPassword, userName, userNickName, userColor, userGender} = req.body;

    let checkUser = await UserModel.findOne({ $or: [{ userNickName:userNickName }, { userMail:userMail }] });
    if( checkUser && checkUser.userMail == userMail)
        return res.json({ msg: "Email already used", status: false, body: req.body });

    if(checkUser && checkUser.userNickName == userNickName)
        return res.json({ msg: "Nickname already used", status: false, body: req.body });
        
    const istanbulTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
    const istanbulDate = new Date(istanbulTime);
    istanbulDate.setHours(istanbulDate.getHours() + 3);

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    await UserModel.countDocuments({userIsActive:true}) === 0 ? IsAdmin = true : IsAdmin = false; 
    console.log(await UserModel.countDocuments({userIsActive:true}));
    checkUser = new UserModel({
        userActive:1,
        userIsAdmin: IsAdmin,
        userMail: userMail,
        userPassword: hashedPassword,
        userName: userName,
        userNickName: userNickName,
        userColor: userColor,
        userGender: userGender,
        userLocation:{
            locationCountry: 'Türkiye',
            locationPostCode: 0,
            locationAddress: 'Ankara',
        },
        userCreatedAt: istanbulDate,
        userLastAccessTime: istanbulDate,
    });

    const result = await checkUser.save();
    if(result) {
        delete checkUser.userPassword;
        return res.json({status:true, result});
    }
    delete checkUser.userPassword;
    return res.json({status:false, msg:'Kayıt başarısız.', checkUser});
};

exports.postLoginUser = async function postLoginUser(req, res) {

    const {userMail, userPassword} = req.body;
    let user = await UserModel.findOne({userMail: userMail});
    if(!user)
        return res.json({ msg: "Incorrect Mail", status: false });

    const hashedPassword = await bcrypt.compare(userPassword, user.userPassword);
    if (!hashedPassword)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    if(user.userActive)
        return res.json({ msg:"the account is passive", status:false}); 

    const istanbulTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
    const istanbulDate = new Date(istanbulTime);
    istanbulDate.setHours(istanbulDate.getHours() + 3);

    user = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { userLastAccessTime: istanbulDate } },
        { new: true } // Güncellenmiş kullanıcı bilgisini döndürmek için {new: true} kullanılabilir
      );
    
    if(user){        
        const token = user.createAuthToken();
        delete user.userPassword;
        return res.status(200).json({ status: true, user, X_Access_Token: token});
    }


    delete user.userPassword;
    return res.json({ status: false, user});
};

exports.getExitUser = async function getExitUser(req, res) {

    try {
        if (!req.params.id) return res.json({ msg: "User id is required ", status: true });
        onlineUsers.delete(req.params.id);
        return res.status(200).send();
    } catch (ex) {
        next(ex);
        return res.status(500).json({ msg: "Server Error", status: false})
    }
};

exports.postChangePasswordUser = async function postChangePasswordUser(req, res) {
    const {userMail, userPassword} = req.body;

    const hashedPassword= await bcrypt.hash(userPassword, 10);
    const user = await UserModel.findOneAndUpdate(
        { userMail: userMail },
        { $set: { userPassword: hashedPassword } },
        { new: true } // Güncellenmiş kullanıcı bilgisini döndürmek için {new: true} kullanılabilir
    );

    if(user){
        delete user.userPassword;
        return res.json({ status: true, user});
    }

    return res.json({ msg:'User not found', status: false, user});
};

exports.postChangeMailUser = async function postChangeMailUser(req, res) {
    const { userMail, newMail } = req.body;

    const user = await UserModel.findOneAndUpdate(
        { userMail: userMail },
        { $set: { userMail: newMail } },
        { new: true } // Güncellenmiş kullanıcı bilgisini döndürmek için {new: true} kullanılabilir
    );

    if(!user)
        return res.json({ msg:'User not found', status: false, user});
    
    delete user.userPassword;
    return res.json({ status: true, user});
    
};

module.exports.getAllUsers = async function getAllUsers (req, res) {
        const users = await UserModel.find({ _id: { $ne: req.params.id } }).select([
          "userMail",
          "userNickName",
          "avatarImage",
          "_id",
        ]);
      
        if (!users) 
          return res.status(404).json({ msg: 'Kayıt Bulunamadı', status: false });
        
        return res.status(200).json({ users, status: true });
};

module.exports.setAvatar = async (req, res) => {
    try{
        const userId = req.params.id;
        console.log(userId);
        const avatarImage = req.body.avatarImage;
        const userData = await usersModel.findByIdAndUpdate(
            {_id: userId},
            { $set: { isAvatarImageSet: true, avatarImage: avatarImage, } },
            { new: true }
        );
        if(!userData)
         return res.status(404).json({ msg: 'Something went wrong', status: false })

         return res.status(200).json({ status: true, userData });
    }catch(error){
        console.log(error);
        return res.status(404).json({ status:false , msg: error.message});
    }


    
   
    
};