import amqp from "amqplib";

async function messageTTL() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();

  await channel.assertQueue('message_ttl', {
    messageTtl: 30000
  })

  channel.publish('', 'message_ttl', Buffer.from('Minha mensagem de 30s'))

}

messageTTL();