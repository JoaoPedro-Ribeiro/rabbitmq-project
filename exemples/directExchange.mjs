import amqp from 'amqplib'

async function main(){
  const conn = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: 'user',
    password: 'password'
  })

  const channel = await conn.createChannel()

  await channel.assertExchange('my_direct_exchange', 'direct', {
    durable: true
  })

  await channel.assertQueue('my_queue', {
    durable: true
  })

  await channel.bindQueue('my_queue', 'my_direct_exchange', 'my_routing_key')

  channel.publish('my_direct_exchange', 'my_routing_key', Buffer.from(`my_message`))

  await channel.close()
  await conn.close()
}

main()