function isAdminMiddleware (req, res, next) {
    if( !req.user.isAdmin){
        res.status(403).send('erişim yetkiniz yok.');
    } 
    next();
}

module.exports = isAdminMiddleware;
