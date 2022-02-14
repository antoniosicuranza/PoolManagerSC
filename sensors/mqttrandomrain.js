var mqtt = require('mqtt');
require('dotenv').config({
	path: '.env'
})

var topic = "iot/sensors/rain"
var connected = false;

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
	if (Math.floor(Math.random() * 30) % 2 == 1) {
		var messages = "rain";
	} else {
		var messages = "not_rain"
	}
	console.log("-> Sending rain: " + messages)
	client.publish(topic, messages.toString());
}


function mainLoop() {
	sendData()
	setTimeout(mainLoop, 10000);
};
