const messageRouter = require('express').Router();
const messageController = require('../controllers/messageController');

messageRouter.post('/addmsg/', messageController.addMessage);
messageRouter.post('/getmsg/', messageController.getMessages);

module.exports = messageRouter;
