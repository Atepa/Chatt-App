const  messageController  = require("../controllers/messageController");
const messageRouter = require("express").Router();

messageRouter.post("/addmsg/", messageController.addMessage);
messageRouter.post("/getmsg/", messageController.getMessages);

module.exports = messageRouter;