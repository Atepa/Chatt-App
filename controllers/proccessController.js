const UserModel = require('../models/userModel');
const proccesModel = require('../models/proccessModels');


exports.getUserById = async function getUserById(req, res) {
    const userId = req.params.userId; 
    let user = await UserModel.findOne({userId: userId});
    if(!user)
        return res.status(404).json({msg:'kullanıcı bulunamadı', status:false });
    
    res.status(200).json({msg:'Kullanıcı bulundu', status: true, user})
};

exports.putChangeUserData = async function putChangeUserData(req, res) {

    const userId = res.params.userId;

    const userWithSameNickName = await UserModel.findOne({
        userNickName: req.body.userNickName,
        _id: { $ne: userId } // Güncellenen kullanıcı dışında aynı nickname'e sahip başka bir kullanıcı arıyoruz
      });
      if (userWithSameNickName) {
        return res.status(400).json({ message: 'Allready Used This Nickname.', status: false });
      }

    const user = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: 
            { 
            userActive: req.body.userActive ,
            userName: req.body.userName ,
            userNickName: req.body.userNickName ,
            userColor: req.body.userColor ,
            userGender: req.body.userGender ,
            userDeActivateTime: req.body.userDeActivateTime ,
            userProfilePhotoUrl: req.userProfilePhotoUrl,
            } ,
        },
        { new: true } 
    );
    if(user){
        delete user.userPassword;   
        return res.status(200).json({ status: true, user });
    }
    return res.status(404).json({msg:'No User', status:false });
};


exports.getProccessByUserId = async function getProccessByUserId(req, res) {
    const userId = req.params.userId;
    const proccess = proccesModel.find({userId: userId}).limit(20);
    if(!proccess) 
        return res.status(404).json({msg:'No User', status:false});

    return res.status(200).json({status: true, proccess});
};

exports.getProccessById = async function getProccessById(req, res) {
    const {userId, proccesId }= req.params;
    const proccess = proccesModel.find({ userId: userId, _id: proccesId });
    if(!proccess) 
        return res.status(404).json({msg:'No Data', status:false});

    return res.status(200).json({status: true, proccess});
};

exports.postCalculateUser = async function postCalculateUser(req, res) {
    const { data1, data2, proccessString } = req.body;
    let result = 0; let msg =''; let status; let statusCode;

    if(proccessString === '+'){
        result = data1 + data2; 
        statusCode = 200
        msg = `toplama işlemini sonucu ${result}` ;
        status = true;
    }
    else if(proccessString === '-'){
        result = data1 - data2;
        statusCode = 200
        msg = `çıkarma işlemini sonucu ${result}` ;
        status = true;
    }
    else if(proccessString === '/'){
        result = data1 / data2;
        statusCode = 200
        msg = `bölme işlemini sonucu ${result}` ;
        status = true;
    }
    else if(proccessString === '*'){
        result = data1 * data2;
        statusCode = 200
        msg = `çarpma işlemini sonucu ${result}` ;
        status = true;
    }
    else {
        status = false;
        statusCode = 400;
        msg = 'tanımsız işlem'
    }

    const newProccess = new proccesModel({
        userId: req._id,
        proccesData1: data1,
        processData2:data2,
        proccessResult: result,
        proccessType: proccessString,
    });
    const proccess= await newProccess.save();
    if(!proccess){
        return res.status(400).json({msg:`İşlem veri tabanına kaydedilemedi`, status:false})
    }
    return res.status(statusCode).json({ msg, status, proccess});
};

exports.getBestUsers = async function getBestUsers(req, res) {
    return res.status(200).json({msg: 'coming soon...', status: true});
};
