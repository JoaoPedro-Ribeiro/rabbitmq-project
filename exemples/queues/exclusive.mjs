import amqp from "amqplib";
import { randomUUID } from "crypto";

async function exclusive() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();

  await channel.assertQueue("exclusive", {
    exclusive: true,
  });

  channel.prefetch(3)
  channel.consume("exclusive", (data) => {
    console.log(data.content.toString());
    setTimeout(() => {
      channel.ack(data)
    }, 1000)
  });

  for (let i = 0; i < 10; i++) {
    channel.publish(
      "",
      "exclusive",
      Buffer.from(`Mensagem exclusiva - ${randomUUID()}`)
    );
  }
}

exclusive();