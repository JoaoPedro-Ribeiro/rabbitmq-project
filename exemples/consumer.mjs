import amqp from 'amqplib'

async function main(){
  const conn = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: 'user',
    password: 'password'
  })

  const channel = await conn.createChannel()

  await channel.assertQueue('my_queue', {
    durable: true
  })

  channel.consume('my_queue', message => {
    console.log(message.content.toString())
    channel.ack(message)
  })
}

main()