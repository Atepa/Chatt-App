const express = require('express');
const redis = require('redis');
const cors = require('cors');
const socket = require('socket.io');
require('dotenv').config();

const proccessRouter = require('./routes/proccessRoute');
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');
const mainRouter = require('./routes/mainRoute');
const messageRouter = require('./routes/messageRoute');
const dbConnect = require('./db/databaseMongo');

const app = express();

require('./middleware/production') (app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true} ));

var redisClient = redis.createClient();

redisClient.on('connect', function(){
    console.log('Redis Client bağlantı');
});

redisClient.on('error', function(err){
    console.log('Redis Client error',err);
}); 
// Redis End

app.use('/api/messages',messageRouter)
// app.use('/', mainRouter)
app.use('/api/admin', adminRouter);
app.use('/api/auth',userRouter)
app.use('/api/proccess', proccessRouter);
app.use('*', (req, res) => {
    res.status(404).send('Invalid Url!');
  });


const server = app.listen(process.env.PORT, ()=>{ 
    dbConnect.connect();
    redisClient.connect()
    console.log(`App is Running on port: ${process.env.PORT}`);
});

const io = socket(server, {
cors: {
    origin: "http://localhost:3000",
    credentials: true,
},
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

