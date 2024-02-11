const UserModel = require('../models/userModel');
const ProccesModel = require('../models/proccessModels');
const bcrypt = require('bcrypt');

exports.postAdminLogin = async function postAdminLogin(req, res) {

    const {userMail, userPassword} = req.body;
    let user = await UserModel.findOne({userMail: userMail, userIsAdmin: true});
    if(!user)
        return res.json({ msg: "Incorrect Mail", status: false });

    const hashedPassword = await bcrypt.compare(userPassword, user.userPassword);
    if (!hashedPassword)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    if(!user.userIsActive)
        return res.json({ msg:"the account is passive", status:false}); 

    const istanbulTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
    const istanbulDate = new Date(istanbulTime);
    istanbulDate.setHours(istanbulDate.getHours() + 3);

    user = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { userLastAccessTime: istanbulDate } },
        { new: true }
      );

    delete user.userPassword;

    if(user){        
        const token = user.createAuthToken();
        return res.status(200).json({ status: true, user, X_Access_Admin_Token: token});
    }

    return res.json({ msg:'Something went wrong...',status: false, user});
};

exports.postAdminExit = async function postAdminExit(req, res) {

    try {
        return res.json({ msg: 'Logout Access', status: true });
    } catch (error) {
        return res.status(500).json({ msg: 'Logout Failed', status: false });
    }
};

exports.getAllUsers = async function getAllUsers(req, res) {
    let page = req.params.page * 10;
    if(page < 0 ) page = 0;
    let users = await UserModel.find().select().limit(20).skip(page);
    if(!users) 
        return res.status(200).json({ msg: 'No User', status: true});

    return res.status(200).json({ status: true, users });
};

exports.getUserByUserId = async function getUserByUserId(req, res) {

    const userId = req.params.userId;
    const users = await UserModel.findOne({ _id: userId });
    if(!users) 
        return res.status(404).json({ msg: 'No User', status: true});

    return res.status(200).json({ status: true, users });
};

exports.putUserByUserId = async function putUserByUserId(req, res) {
    
    const userId = req.params.userId;

    const user = await UserModel.find({ _id: userId});
    if(!user)
        return res.status(404).json({ msg: 'No User', status: true});

    const bodyUser = new UserModel(req.body);   // kontrol edilecek
    const result = await bodyUser.save();

    return res.status(200).json({ status: true, result});
};

exports.getUserProccessByUserId = async function getUserProccessByUserId(req, res) {

    const userId = req.params.userId; 
    const userProccesses = await ProccessModel.find({ userId: userId }).sort({ proccesTime: 1});
    if(!userProccesses)
        return res.status(404).json({ msg: 'No User', status:false });

    return res.status(200).json({ status: true, userProccesses });
};

exports.getUserProccessByProccessId = async function getUserProccessByProccessId(req, res) {

    const {userId, proccessId} = req.params; 
    const proccessesData = await ProccessModel.find({ userId: userId, _id: proccessId});
    if(!proccessesData) 
        return res.status(404).json({ msg: 'No Data. UserId Or ProccesId Wrong.', status: false });

    return res.status(200).json({ status:true, proccessesData});
};

exports.deleteUserProccessByProccessId = async function deleteUserProccessByProccessId(req, res) {

    const {userId, proccessId} = req.params; 
    const proccessesData = await ProccessModel.findOneAndUpdate(
        { userId: userId, _id: proccessId},
        { $set: { proccessVisible: false } },
        { new: true }, // Güncellenmiş kullanıcı bilgisini döndürmek için {new: true} kullanılabilir
    );
    if(!proccessesData) 
        return res.status(404).json({ msg: 'No Data. UserId Or ProccesId Wrong.', status: false });

    return res.status(200).json({ status:true, proccessesData});
};

exports.deleteUserByUserId = async function deleteUserByUserId(req, res) {
    const userId = req.params.userId;

    const user = await UserModel.findOneAndUpdate(
        {_id: userId},
        { $set: { userIsActive: false }},
        { new: true },
    );
    if(!user)
        return res.status(404).json({ msg: 'No User', status:false });

    return res.status(200).json({ status: true, user});
};

