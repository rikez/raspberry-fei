# rpi-router

The rpi-router is a microservice responsible for handling HTTP Requests originated by the rpi-sensor-collector, which is located on Raspberry PI 3 devices. Furthermore, it has Apache Kafka as a dependency, in order to publish the collected metrics on a topic consumed by two other microservices, responsible for processing the message.

## Running locally

```
 npm install

 npm start
```

## Docker Container

```
  docker build . -t rpi-router
  docker run --env-file .env --restart unless-stopped -p 8082:8082 --memory="2g" --cpus="2.0" -d rpi-router
```


## Request Example

```
  curl -d '{"deviceId":"12345", "temperature": 10, "humidity": 15}' -H "Content-Type: application/json" -X POST http://localhost:8082/metrics/dht22
```
