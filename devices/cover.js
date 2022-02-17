

var mqtt = require('mqtt');
var request = require('request')
require('dotenv').config({
	path: '../../.env'
})

var clientId = "cover"
var username = "guest"
var password = "guest"
var state = false
var rain = "not_rain"
var temp = "high_temp"
var time = "cover_off"

var client = mqtt.connect("mqtt://"+ process.env.IP+":1883", {
	clientId: clientId,
	username: username,
	password: password
});
client.on('message', function (topic, message, packet) {
	// show the logs
	console.log(message.toString())
	switch (message.toString()) {
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

	if (state == false && (rain == "rain" || temp == "low_temp" || time == "cover_on")) {
		state = true
		closePool()
	} else if (state == true && rain == "not_rain" && temp == "high_temp" && time == "cover_off") {
		state = false
		openPool()
	}


});

client.on("connect", function () {
	console.log("\nconnected  " + client.connected);
})

var topic = "iot/devices/cover";
client.subscribe(topic, {
	qos: 2
});

function openPool() {
	console.log("Pool opened");
	sendMail(true)
}

function closePool() {
	console.log("Pool closed");
	sendMail(false)
}

function sendMail(state) {
	if (state) {
		var mail = "Attention! The pool is opening!"
	} else {
		var mail = "Attention! The pool is closing!"
	}
	request({
		url: ' https://maker.ifttt.com/trigger/telegram/with/key/ddh6LNOQa8mI7_AWJ-LZiodDvKGIuILoSdDQtbbrq7x',
		qs: {
			"value1": mail,


		},
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	}, function (error, response, body) {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
	});
}


