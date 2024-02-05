const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/')
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)  
    }
});

var upload = multer({ 
    storage: storage, 
    fileFilter: function(req, file, callback){
        if(
            file.mimetype == "image/*" ||
            file.mimetype == "video/*" 
        ){
            callback(null, true);
        } else {
            console.log('only video and image');
            callback(null, false);
        }
    },
    limits: { 
        fieldSize: 20 * 1024 * 1024,
    }
}).single("file");

module.exports = upload;