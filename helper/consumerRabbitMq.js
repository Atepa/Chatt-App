const amqp = require('amqplib');

async function onConsumeEmail() {
    const connection = await amqp.connect('amqp://admin:admin@localhost');
    const channel = await connection.createChannel();
    const queueName = 'forgotPasswordQueue';
    await channel.assertQueue(queueName, {durable: false});

    channel.consume(queueName, (message) => {
        const content = message.content.toString();

        const data = JSON.parse(content);
        setTimeout(() => {
            console.log("fefe");
            console.log(data);
            channel.ack(message);
        }, 2000);
        
    })

    
}

onConsumeEmail();
