const usersModel = require('../models/userModel');
const UserModel = require('../models/userModel');
const StoryModel = require('../models/storyModel');
const AccessUsersStoryModel = require('../models/accessUserStory');
const upload = require("../middleware/uploadMulter");

const bcrypt = require('bcrypt');
const storyModel = require('../models/storyModel');
const { response } = require('express');
//const getCurrentDate = require('../helper/getCurrentDate');

exports.postCreateUser = async function postCreateUser(req, res) {

    const {userMail, userPassword, userName, userNickName, userColor, userGender} = req.body;
    let checkUser = await UserModel.findOne({ $or: [{ userNickName:userNickName }, { userMail:userMail }] })
    .then( res => {
        if( checkUser && checkUser.userMail == userMail)
            return res.json({ msg: "Email already used", status: false, body: req.body });

        if(checkUser && checkUser.userNickName == userNickName)
            return res.json({ msg: "Nickname already used", status: false, body: req.body });
    })
    .catch( error => {
        return res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false })
    })
        
    const istanbulTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
    const istanbulDate = new Date(istanbulTime);
    istanbulDate.setHours(istanbulDate.getHours() + 3);

    const IsAdmin = false;
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    await UserModel.countDocuments({userIsActive:true})
    .then( res => {
        res === 0 ? IsAdmin = true : IsAdmin = false; 
    })
    .catch( error => {
        return res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false })
    })

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

    await checkUser.save()
    .then( res => {
        delete checkUser.userPassword;
        delete res.userPassword;
        return res.json({status:true, result});
    })
    .catch( error => {
        delete checkUser.userPassword;
        return res.status(500).json({ msg: `Kayıt Başarısız -- ${error.message}`, checkUser, status: false })

    })
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
    const { userPassword} = req.body;
    const hashedPassword= await bcrypt.hash(userPassword, 10);
    const user = await UserModel.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { userPassword: hashedPassword } },
        { new: true } 
    )
    .then(res => {
        delete user.userPassword;
        return res.json({ status: true, user});    
    })
    .catch( error=> {
        return res.status(500).json({ msg: `Kullanıcı Bulunamadı -- ${error.message}`, status: false })
    })
};

exports.postChangeMailUser = async function postChangeMailUser(req, res) {
    const { userMail, newMail } = req.body;
    await UserModel.findOneAndUpdate(
        { userMail: userMail },
        { $set: { userMail: newMail } },
        { new: true } 
    )
    .then(res => {
        delete user.userPassword;
        return res.json({ status: true, user});    })
    .catch( error=> {
        return res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false })
    })
};

module.exports.getAllUsers = async function getAllUsers (req, res) {
    await UserModel.find({ _id: { $ne: req.params.id } }).select([
        "userMail",
        "userNickName",
        "avatarImage",
        "hasStory",
        "_id",
    ])
    .then(response => {
        return res.status(200).json({ response, status: true });
    })
    .catch( error=> {   
        return res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false })
    })
};

module.exports.setAvatar = async function setAvatar (req, res) {
    const userId = req.params.id;
    const avatarImage = req.body.avatarImage;
    await usersModel.findByIdAndUpdate(
        {_id: userId},
        { $set: { isAvatarImageSet: true, avatarImage: avatarImage, } },
        { new: true }
    )
    .then(response => {
        return res.status(200).json({ status: true, response });

    })
    .catch( error=> {
        return res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false })
        
    })
};

module.exports.getStories = async function getStories (req, res) {
    await UserModel.find({ hasStory: true }).select([
        "avatarImage",
        "userNickName",
        "_id",
        "hasStory",
    ])
    .then(response => {
        if(response.length > 0)
            return res.status(200).json({ response, status: true });
        else 
            return res.status(200).json({ msg: `Kullanıcı Bir Story'e Sahip Değil`, status: true });
    })
    .catch( error=> {
        return res.status(500).json({ msg: `Server Error -- ${error.message}`, status: false })
    })
};

module.exports.getStoryByUserId = async function getStoryByUserId (req, res) {

    await StoryModel.find({ senderUserId: req.params.userId }).select([
        "_id",
        "senderUserId",
        "senderUserAvatarImage",
        "senderUserNickName",
        "storyPath",
        "duration",
        "createdAt",
        "isActive",
    ])
    .then(response => {
        if(response.length === 0)
            return res.status(404).json({ msg:"Kullanıcı Bir Story'ye Sahip Değil.", status: true });
        else
            return res.status(200).json({ response, status: true });
    })
    .catch(error => {
        return res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false });
    })
};

module.exports.deleteStoryByStoryId = async function deleteStoryByStoryId (req, res) {

    console.log("istek geldi");
    await StoryModel.findOneAndDelete({_id: req.params.storyId} )
    .then(async response => {
        if(response.length === 0){
            console.log(response);
            return res.status(404).json({ msg:"Story Bulunamadı.", response, status: true });
        }
        else{
            return res.status(200).json({ msg:"Başarıyla Silindi", status: true });
        }
    })
    .catch(error => {
        return res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false });
    })
};


module.exports.getUserByUserId = async function getUserByUserId (req, res) {
    await UserModel.find({ _id: req.params.userId}).select([
        "userMail",
        "userName",
        "userNickName",
        "userColor",
        "userGender",
        "userCreatedAt",
        "userLastAccessTime",
        "isAvatarImageSet",
        "avatarImage"
    ])
    .then(response => { return res.status(200).json({ response, status: true }); })
    .catch( (error) => { return res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false });})
};

module.exports.putUserByUserId = async function putUserByUserId (req, res) {    
    const { standartValues } = req.body;
    await UserModel.findByIdAndUpdate(
        req.params.userId,
        { $set: standartValues }, 
        { new: true } 
    ) 
    .then(response => { return res.status(200).json({ response, status: true }); })
    .catch( (error) => { return res.status(404).json({ msg: `Kayıt Bulunamadı -- ${error}`, status: false });})
};

module.exports.putUserPasswordByUserId = async function putUserPasswordByUserId (req, res) { 
    const { oldUserPassword ,newUserPassword } = req.body;
    const newHashedPassword = await bcrypt.hash(newUserPassword, 10);
    await UserModel.find({ _id: req.params.userId }).select(["userPassword"])
    .then(async response => {     
        const hashedPassword = await bcrypt.compare(oldUserPassword, response[0].userPassword);
        if(!hashedPassword) 
            return res.status(200).json({ msg: `Mevcut Şifreniz Doğru Değil`, status: false});
            await UserModel.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: { userPassword: newHashedPassword } },
                { new: true } 
            )
            .then(response => { return res.status(200).json({ response, status: true }); })
            .catch( (error) => { return res.status(404).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false });})
    })
    .catch( (error) => { return res.status(500).json({ msg: `Kayıt Bulunamadı -- ${error.message}`, status: false });})
};

module.exports.postStoryById = async function postStoryById (req, res) {
    await UserModel.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { hasStory: true } },
        { new: false } 
    )
    .then( response => {
        response? delete response.userPassword : null ;
    })
    .catch( error => { 
        return res.status(404).json({ status:false, msg:`Kayıt Başarısız -- ${error.message}`}) 
    })
    const Story = new storyModel({
        senderUserId: req.params.userId,
        senderUserAvatarImage: req.body.senderUserAvatarImage,
        senderUserNickName: req.body.senderUserNickName,
        duration: req.body.duration,
        storyPath: req.file.path,
        size: req.file.size,
    });
    await Story.save()
    .then(response => {
        return res.status(200).json({status:true, response});
    })
    .catch(error => {
        return res.status(500).json({status:false, msg:`Kayıt Başarısız -- ${error.message}`});
    })   
    
};