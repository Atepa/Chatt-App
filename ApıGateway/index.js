const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware')
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const port = 8080;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/user-service', createProxyMiddleware({
    target:'http://127.0.0.1:8081',
    changeOrigin: true, // eklediğimiz kısım
    pathRewrite: {
        '^/user-service': '/api' // değiştirilen kısım
    }
}));

app.use('/message-service', createProxyMiddleware({
    target:'http://127.0.0.1:8082',
    changeOrigin: true, // eklediğimiz kısım
    pathRewrite: {
        '^/message-service': '/api' // değiştirilen kısım
    }
}));

app.use('/admin-service', createProxyMiddleware({
    target:'http://127.0.0.1:8083',
    changeOrigin: true, // eklediğimiz kısım
    pathRewrite: {
        '^/admin-service': '/api' // değiştirilen kısım
    }
}));

app.listen(port, ()=>{
    console.log('Apı gateway service running at http://127.0.0.1:' +port);
})