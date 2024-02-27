const express = require('express');
require('dotenv').config();
require('winston-mongodb');
const bodyParser = require('body-parser');

const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const expressWinston = require('express-winston');
const socket = require('socket.io');
const { transports, format } = require('winston');

const port = 8080;

app.use(expressWinston.logger({
  transports: [
    // new transports.File({
    //   level: 'warn',
    //   filename: 'logWarning.log',
    // }),
    // new transports.File({
    //   level: 'error',
    //   filename: 'logErroring.log',
    // }),
    // new transports.File({
    //   level: 'info',
    //   filename: 'logInfoing.log',
    // }),
    // new transports.File({
    //   level: 'debug',
    //   filename: 'logDebuging.log',
    // }),
    new transports.MongoDB({
      db: process.env.Mongodb_Logger_Uri,
      collection: process.env.Mongodb_Logger_Collection,
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp({ format: 'YYYY-MM-DD HH-mm:ss-SSS' }),
    format.metadata(),
    format.prettyPrint(),
  ),
  statusLevels: true,
}));
app.use('/user-service', createProxyMiddleware({
  target: 'http://127.0.0.1:8081',
  changeOrigin: true, // eklediğimiz kısım
  pathRewrite: {
    '^/user-service': '/api', // değiştirilen kısım
  },
}));

app.use('/message-service', createProxyMiddleware({
  target: 'http://127.0.0.1:8082',
  changeOrigin: true, // eklediğimiz kısım
  pathRewrite: {
    '^/message-service': '/api', // değiştirilen kısım
  },
}));

app.use('/admin-service', createProxyMiddleware({
  target: 'http://127.0.0.1:8083',
  changeOrigin: true, // eklediğimiz kısım
  pathRewrite: {
    '^/admin-service': '/api', // değiştirilen kısım
  },
}));

const server = app.listen(port, () => {
  console.log(`Apı gateway service running at http://127.0.0.1:${port}`);
});

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.msg);
    }
  });
});
