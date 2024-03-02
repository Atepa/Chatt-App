const amqp = require('amqplib');

async function sendResetPasswordEmail(mail, jwtRefreshToken, id) {
  try {
    const connection = await amqp.connect('amqp://admin:admin@localhost');
    // const connection = await amqp.connect('amqp://admin:admin@service-rabbitmq');
    const channel = await connection.createChannel();
    const queueName = 'forgotPasswordQueue';
    await channel.assertQueue(queueName, { durable: false });
    const message = JSON.stringify({
      userEmail: mail,
      token: jwtRefreshToken,
      _id: id,
    });
    channel.sendToQueue(queueName, Buffer.from(message));
    return true;
  } catch (error) {
    console.error('error:', error.message);
    return false;
  }
}

module.exports = sendResetPasswordEmail;
