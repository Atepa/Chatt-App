if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
require('winston-mongodb');

const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const expressWinston = require('express-winston');
const socket = require('socket.io');
const { transports, format } = require('winston');
const cors = require('cors');
const { MongoDB } = require('winston-mongodb'); // MongoDB transportı import ediliyor
const rateLimit = require('./rateLimit');
const globalError = require('./globalError');

const port = 8080;

app.use(rateLimit);
app.use(globalError);

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(expressWinston.logger({
  transports: [
    new transports.File({
      level: 'debug',
      filename: 'logDebuging.log',
    }),
    new MongoDB({
      db: process.env.Mongodb_Logger_Uri,
      collection: process.env.Mongodb_Logger_Collection,
      options: { useUnifiedTopology: true },
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
  target: 'http://localhost:8081',
  // target: 'http://user-service:8081',
  changeOrigin: true,
  pathRewrite: {
    '^/user-service': '/api',
  },
}));

app.use('/message-service', createProxyMiddleware({
  target: 'http://localhost:8082',
  // target: 'http://message-service:8082',
  changeOrigin: true,
  pathRewrite: {
    '^/message-service': '/api',
  },
}));

app.use('/admin-service', createProxyMiddleware({
  target: 'http://localhost:8083',
  // target: 'http://admin-service:8083',
  changeOrigin: true,
  pathRewrite: {
    '^/admin-service': '/api',
  },
}));

const server = app.listen(process.env.PORT, () => {
  console.log(`Apı gateway service running at http://127.0.0.1:${process.env.PORT}`);
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
