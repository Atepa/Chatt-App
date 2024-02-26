const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function onConsumeEmail() {
  const connection = await amqp.connect('amqp://admin:admin@localhost');
  const channel = await connection.createChannel();
  const queueName = 'forgotPasswordQueue';
  await channel.assertQueue(queueName, { durable: false });

  channel.consume(queueName, async (message) => {
    const content = message.content.toString();
    const data = JSON.parse(content);

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        service: 'hotmail',
        port: 587,
        secure: false,
        auth: {
          user: 'veratis_13579@hotmail.com',
          pass: 'denemexx',
        },
      });
      await transporter.sendMail({
        from: 'Atepa Soft',
        to: data.userEmail,
        subject: 'Şifre Sıfırlama - Atepa',
        html: `Şifre Yenilemek İçin =><a href="http://localhost:3000/account/password/reset/${data.token}/${data._id}">http://localhost:3000/account/password/reset/${data.token}/${data._id}</a>`,
      });
      channel.ack(message);
    } catch (error) {
      console.log(error);
    }
  });
}

onConsumeEmail();
