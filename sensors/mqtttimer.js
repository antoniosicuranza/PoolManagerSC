var mqtt = require('mqtt');
require('dotenv').config({
	path: '.env'
})

var topic = "iot/sensors/time"
var connected = false;
const d = new Date();
var options = {
	port: 1883,
	host: "mqtt://" + process.env.IP,
	clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
	username: 'guest',
	password: 'guest',
};

var client = mqtt.connect("mqtt://" + process.env.IP, options);

client.on("connect", function () {
	connected = true;
	mainLoop();
})

function sendData() {

	let hour = d.getHours();
	let minutes = d.getMinutes();
	message = "Time:" + hour + ":" + minutes

	console.log(message)
	client.publish(topic, message);
}


function mainLoop() {
	sendData()
	setTimeout(mainLoop, 60000);
};
