const jwt = require('jsonwebtoken');

function tokenAuth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Yetkisiz Giriş');
  try {
    const decodedToken = jwt.verify(token, 'privateappkey');
    req._id = decodedToken._id;
    req.isAdmin = decodedToken.isAdmin;
    next();
  } catch (ex) {
    res.status(401).send({ msg: `${ex}---hatalı token`, status: false });
  }
}

module.exports = tokenAuth;
