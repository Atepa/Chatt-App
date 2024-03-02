const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'userService/public/');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, callback) {
    if (
      file.mimetype === 'image/*'
      || file.mimetype === 'video/*'
    ) {
      callback(null, true);
    } else {
      console.log('only video and image');
      callback(null, false);
    }
  },
  limits: {
    fieldSize: 20 * 1024 * 1024,
  },
}).single('file');

module.exports = upload;
