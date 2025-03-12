import amqp from 'amqplib'

async function main(){
  const connection = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: 'user',
    password: 'password'
  })

  const channel = await connection.createChannel()

  await channel.assertQueue('my_queue', {
    durable: true
  })

  for (let i = 1; i <=1000; i++){
    channel.publish('', 'my_queue', Buffer.from(`my_message`))
  }
  await channel.close()

  await connection.close()
}

main()