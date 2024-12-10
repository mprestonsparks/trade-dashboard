## RabbitMQ Integration
Each service may publish or subscribe to messages that guide system behavior and data flow.
## Use Cases
- **Market Analysis**: Publish market state updates or signals for consumption by Trade Discovery and Trade Manager.
- **Trade Manager**: Publish trade executions or requests for updated market beliefs.
- **Trade Discovery**: Consume signals from Market Analysis, request candidate actions from Trade Manager, publish discovered opportunities.
## Example with `aio_pika`
```python
import aio_pika
import json

async def publish_message(url, exchange_name, routing_key, message: dict):
    connection = await aio_pika.connect_robust(url)
    async with connection:
        channel = await connection.channel()
        exchange = await channel.declare_exchange(exchange_name, aio_pika.ExchangeType.TOPIC)
        msg = aio_pika.Message(body=json.dumps(message).encode())
        await exchange.publish(msg, routing_key=routing_key)

async def consume_messages(url, queue_name, callback):
    connection = await aio_pika.connect_robust(url)
    async with connection:
        channel = await connection.channel()
        queue = await channel.declare_queue(queue_name, durable=True)
        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    data = json.loads(message.body.decode())
                    await callback(data)
```
**Routing Key & Exchange Design:**
- `market.signals`: Market Analysis publishes.
- `trade.opportunities`: Trade Discovery publishes discovered opportunities.
- `trade.requests`: Trade Manager can request state updates or confirm actions.
Adjust routing keys as needed. Proper message handling ensures a decoupled, scalable architecture.