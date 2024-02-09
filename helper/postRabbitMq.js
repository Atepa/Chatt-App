const amqp = require('amqplib');

async function sendResetPasswordEmail(mail, id) {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost');
        const channel = await connection.createChannel();
        const queueName = 'forgotPasswordQueue';
        await channel.assertQueue(queueName,{ durable: false });
        const message = JSON.stringify({ 
            userEmail: mail,
            _id: id,
        });
        channel.sendToQueue(queueName, Buffer.from(message));
        return true;
    } catch (error) {
        console.error("error:",error.message);
        return false;
    }
}

module.exports = sendResetPasswordEmail;
