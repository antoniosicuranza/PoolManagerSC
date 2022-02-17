

var mqtt = require('mqtt');
require('dotenv').config({
	path: '../../.env'
})

var clientId = "app"
var username = "guest"
var password = "guest"
var stateCover = false
var stateLight = false
var rain = "not_rain"
var temp = "high_temp"
var time = "cover_off"
var sun = "sun"
var temperature = "null"

var client = mqtt.connect("mqtt://"+ process.env.IP+":1883", {
	clientId: clientId,
	username: username,
	password: password
});
client.on('message', function (topic, message, packet) {
	// show the logs
	console.log(message.toString())
	switch (message.toString()) {
		case "sun":
		case "no_sun":
			sun = message.toString()
			break;
		case "rain":
		case "not_rain":
			rain = message.toString()
			break;
		case "low_temp":
		case "high_temp":
			temp = message.toString()
			break;
		case "cover_off":
		case "cover_on":
			time = message.toString()
			break;
		default:
			if (message.toString().indexOf("C°") != -1) {
				temperature = message.toString()
				sendData()
			} else {
				console.log("Invalid message!")
			}
			break;


	}
	if (stateLight == false && sun == "no_sun" && temp == "high_temp" && time == "cover_off" && rain == "not_rain") {
		stateLight = true
		sendData()
	} else if (stateLight == true && (sun == "sun" || temp == "low_temp" || time == "cover_on" || rain == "rain")) {
		stateLight = false
		sendData()
	}

	if (stateCover == false && (rain == "rain" || temp == "low_temp" || time == "cover_on")) {
		stateCover = true
		sendData()
	} else if (stateCover == true && rain == "not_rain" && temp == "high_temp" && time == "cover_off") {
		stateCover = false
		sendData()
	}
});

client.on("connect", function () {
	console.log("\nconnected  " + client.connected);
})

var topic = "iot/devices/app";
client.subscribe(topic, {
	qos: 2
});

var topic2 = "iot/devices/info"
var connected = false;

var options = {
	port: 1883,
	host: "mqtt://" + process.env.IP,
	clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
	username: 'guest',
	password: 'guest',
};
client.on("connect", function () {
	connected = true;
	mainLoop();
})

function sendData() {
	var messages = "Cover:" + (stateCover ? "Close" : "Open") + "\nLight:" + (stateLight ? "On" : "Off") + "\nTemperature:" + temperature
	console.log("Info:" + messages)
	client.publish(topic2, messages);
}


function mainLoop() {

	setTimeout(mainLoop, 10000);
};


