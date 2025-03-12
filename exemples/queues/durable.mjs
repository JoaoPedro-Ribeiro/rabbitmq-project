import amqp from "amqplib";

async function durable() {
  const connection = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await connection.createChannel();

  await channel.assertQueue("durable", {
    durable: true,
  });

  await channel.assertQueue("not_durable", {
    durable: false,
  });

  channel.publish("", "durable", Buffer.from("Mensagem duravel"), {
    persistent: true,
  });
  channel.publish("", "not_durable", Buffer.from("Mensagem não duravel"));

  await channel.close();
  await connection.close();
}

durable();