const express = require('express');
const redis = require('redis');
const cors = require('cors');
require('dotenv').config();

const userRouter = require('./routes/userRoute');
const dbConnect = require('./db/databaseMongo');

const app = express();

require('./middleware/production')(app);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('Redis Client bağlantı');
});

redisClient.on('error', (err) => {
  console.log('Redis Client error', err);
});
// Redis End

app.use('/api/auth', userRouter);

app.use('*', (req, res) => {
  const invalidUrl = req.originalUrl;
  res.status(404).send(`Invalid Url: ${invalidUrl}`);
});

app.listen(process.env.PORT, () => {
  dbConnect.connect();
  redisClient.connect();
  console.log(`App is Running on port: ${process.env.PORT}`);
});
