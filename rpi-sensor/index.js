'use strict';

require('dotenv');
const sensor = require('node-dht-sensor');
const fetch = require('node-fetch');

console.log('Starting... envs: ', process.env);


const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

/**
 *  * Reads the GPIO 4 port
 *   * @returns {Promise<{ temperature: number, humidity: number }>}
 *    */
function sensorAsync() {
  return new Promise((resolve, reject) => {
    sensor.read(22, 4, (err, temperature, humidity) => {
      if (err) {
        reject(`Failed to get the temperature and humidity from the DHT22: ${err.message}\n${err.stack}`);
      } else {
        resolve({ temperature, humidity });

      }
    });
  })
}

let running = true;

process.on('SIGINT', () => {
  console.log('Disposing sensor...');
  running = false;
})

async function loop() {
  while (running) {
    try {
      const { temperature, humidity } = await sensorAsync();
      console.log(`DeviceID: ${process.env.deviceId} Temperature: ${temperature} °C \t Humidity: ${humidity}`);

      const body = {
        temperature,
        humidity,
        deviceId: process.env.DEVICE_ID
      };

      await fetch(process.env.API_URL, {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })

    } catch (error) {
      console.error('Got an error: ', error);
    } finally {
      await sleep(process.env.FREQUENCY);
    }
  }
}

loop();