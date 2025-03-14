import amqp from "amqplib";

async function maxLength() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();

  await channel.assertQueue('max_length', {
    maxLength: 1000
  })

  for(let i=1; i<=1400; i++){
    channel.publish('', 'max_length', Buffer.from(`Minha mensagem ${i}`))
  }

}

maxLength();