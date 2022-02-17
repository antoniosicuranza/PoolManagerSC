var mqtt = require('mqtt');
require('dotenv').config({
	path: '../../.env'
})

var clientId = "light"
var username = "guest"
var password = "guest"
var state = false
var sun = "sun"
var temp = "high_temp"
var time = "cover_off"
var rain = "not_rain"

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
			console.log("Invalid message!")
			break;


	}
	if (state == false && sun == "no_sun" && temp == "high_temp" && time == "cover_off" && rain == "not_rain") {
		state = true
		lightOn()
	} else if (state == true && (sun == "sun" || temp == "low_temp" || time == "cover_on" || rain == "rain")) {
		state = false
		lightOff()
	}

});

client.on("connect", function () {
	console.log("\nconnected  " + client.connected);
})

var topic = "iot/devices/light";
client.subscribe(topic, {
	qos: 2
});

function lightOn() {
	console.log("Light On");

}

function lightOff() {
	console.log("Light Off");

}



