const express = require('express');
const redis = require('redis');
const cors = require('cors');
const socket = require('socket.io');
require('dotenv').config();

const adminRouter = require('./routes/adminRoute');
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

app.use('/api/admin', adminRouter);
app.use('*', (req, res) => {
  const invalidUrl = req.originalUrl;
  res.status(404).send(`Invalid Url: ${invalidUrl}`);
});

const server = app.listen(process.env.PORT, ()=>{ 
    dbConnect.connect();
    redisClient.connect()
    console.log(`App is Running on port: ${process.env.PORT}`);
});
