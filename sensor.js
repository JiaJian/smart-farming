const five = require('johnny-five');
const board = new five.Board();

var io = require('socket.io-client'),
socket = io.connect('localhost', {
    port: 8000
});
socket.on('connect', function () {
  console.log("socket connected");
});

const beta = 3975; // Beta value of the thermistor used by Grove's temperature sensor.

board.on('ready', () => {
  const lightSensor = new five.Sensor({
    pin: 'A0',
    threshold: 2,
    freq: 1000
  });

  const temperatureSensor = new five.Sensor({
    pin: 'A1',
    threshold: 2
  });

  const airQualitySensor = new five.Sensor({
    pin: 'A2',
    threshold: 2
  });

  lightSensor.on('change', (value) => {
    console.log("Sending node-light event with value: ", value);

    socket.emit('node-light', { value: value });
  });

  temperatureSensor.on('change', (value) => {
    let temperature, resistance;
    resistance = (1023-value)*10000/value; // Determine the current resistance of the thermistor based on the sensor value.
    temperature = 1/(Math.log(resistance/10000)/beta+1/298.15) - 273.15;  // Calculate the temperature based on the resistance value.

    temperature = +temperature.toFixed(2);
    console.log("Sending node-temperature event with value: ", temperature);
    socket.emit('node-temperature', { value: temperature });
  });
});
