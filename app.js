const five = require('johnny-five');
const board = new five.Board();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');

const SERVER_PORT = 8000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'index.html');
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Resource not found'
  });
});

const beta = 3975; // Beta value of the thermistor used by Grove's temperature sensor.

io.on('connection', (socket) => {
  console.log('Connection has been established with browser.');
  socket.on('disconnect', () => {
    console.log('Browser client disconnected from the connection.');
  });

  board.on('ready', () => {
    const lightSensor = new five.Sensor({
      pin: 'A0',
      threshold: 1,
      freq: 1000
    });
  
    const temperatureSensor = new five.Sensor({
      pin: 'A1',
      threshold: 1,
      freq: 1000
    });
  
    const soilMoistureSensor = new five.Sensor({
      pin: 'A5',
      threshold: 1,
      freq: 1000
    });
  
    lightSensor.on('change', (value) => {
      console.log("Sending data-light event with value: ", value);

      socket.emit('data-light', {
        data: value,
        time: (new Date()).getTime() //moment().format()
      });
    });
  
    temperatureSensor.on('change', (value) => {
      let temperature, resistance;
      resistance = (1023-value)*10000/value; // Determine the current resistance of the thermistor based on the sensor value.
      temperature = 1/(Math.log(resistance/10000)/beta+1/298.15) - 273.15;  // Calculate the temperature based on the resistance value.
  
      temperature = +temperature.toFixed(2); // Round off to 2 decimal places.
      console.log("Sending data-temperature event with value: ", temperature);

      socket.emit('data-temperature', {
        data: temperature,
        time: (new Date()).getTime() //moment().format()
      });
    });

    soilMoistureSensor.on('change', (value) => {
      console.log("Sending data-soil-moisture-level event with value: ", value);

      socket.emit('data-soil-moisture-level', {
        data: value,
        time: (new Date()).getTime() //moment().format()
      });
    });
  });
});

http.listen(process.env.PORT || SERVER_PORT, () => {
  console.log(`[app.js] Server started on the http://localhost:${SERVER_PORT}`);
});