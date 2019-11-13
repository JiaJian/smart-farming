const dweetClient = require('node-dweetio');
const five = require('johnny-five');

const board = new five.Board();
const dweetio = new dweetClient();

const beta = 3975; // Beta value of the thermistor used by Grove's temperature sensor.

board.on('ready', () => {
  const temperatureSensor = new five.Sensor({
    pin: 'A1',
    threshold: 4
  });

  temperatureSensor.on('change', (value) => {
    const dweetThing = 'node-temperature-monitor'; // Event name

    let temperature, resistance;
    resistance = (1023-value)*10000/value; // Determine the current resistance of the thermistor based on the sensor value.
    temperature = 1/Math.log(resistance/10000)/beta+1/298.15 - 273.15;  // Calculate the temperature based on the resistance value.
    const tweetMessage = {
      temperature: +temperature.toFixed(2)
    };

    dweetio.dweet_for(dweetThing, tweetMessage, (err, dweet) => {
      if (err) {
        console.log('[Error]: ', err, dweet);
      }
      if (dweet) {
        console.log(dweet.content);
      }
    });
  });
});