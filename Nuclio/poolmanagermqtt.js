var mqtt = require('mqtt');

const FUNCTION_NAME = "poolmanagermqtt";
// TODO: SET HERE YOUR LOCAL IP
const IP = "192.168.1.8:1883"
const LIGHT_TOPIC = "iot/devices/light"
const COVER_TOPIC = "iot/devices/cover"
const PHONE_TOPIC = "iot/devices/app"
const d = new Date();

//Min pool temperature
const MIN_TEMPERATURE = 10
var openHour = new Date("01/01/2011 08:00:00")
var closeHour = new Date("01/01/2011 22:00:00")

var options = {
	host: 'mqtt://' + IP,
	clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
	username: 'guest',
	password: 'guest',
};


async function send_to_one_topic_mqtt(topic, data) {
	var client = mqtt.connect("mqtt://" + IP, options);
	client.on('connect', function () {
		client.publish(topic, data, function () {
			client.end();
		});
	});
}
async function send_to_two_topic_mqtt(topic1, topic2, data1, data2) {
	var client = mqtt.connect("mqtt://" + IP, options);
	client.on('connect', function () {
		client.publish(topic1, data1, function () {
			client.publish(topic2, data2, function () {
				client.end();
			});
		});
	});
}
async function send_to_three_topic_mqtt(topic1, topic2, topic3, data1, data2, data3) {
	var client = mqtt.connect("mqtt://" + IP, options);
	client.on('connect', function () {
		client.publish(topic1, data1, function () {
			client.publish(topic2, data2, function () {
				client.publish(topic3, data3, function () {
					client.end();
				});
			});
		});
	});
}
async function send_to_four_topic_mqtt(topic1, topic2, topic3, topic4, data1, data2, data3, data4) {
	var client = mqtt.connect("mqtt://" + IP, options);
	client.on('connect', function () {
		client.publish(topic1, data1, function () {
			client.publish(topic2, data2, function () {
				client.publish(topic3, data3, function () {
					client.publish(topic4, data4, function () {
						client.end();
					});
				});
			});
		});
	});
}

function bin2string(array) {
	var result = "";
	for (var i = 0; i < array.length; ++i) {
		result += (String.fromCharCode(array[i]));
	}
	return result;
}

exports.handler = function (context, event) {
	var _event = JSON.parse(JSON.stringify(event));
	var _data = bin2string(_event.body.data);


	switch (_data) {
		case "sun":
		case "no_sun":
			topicMessage = _data
			send_to_two_topic_mqtt(LIGHT_TOPIC, PHONE_TOPIC, topicMessage, topicMessage)
			context.callback("feedback {temperature: " + temperature + ", cover: " + cover + ", light: " + power + "}")
			break;
		case "rain":
		case "not_rain":
			topicMessage = _data
			send_to_three_topic_mqtt(COVER_TOPIC, LIGHT_TOPIC, PHONE_TOPIC, topicMessage, topicMessage, topicMessage)
			context.callback("feedback {temperature: " + temperature + ", cover: " + cover + ", light: " + power + "}")
			break;
		default:
			if (!isNaN(_data)) {
				temperature = Number(_data)

				if (temperature < MIN_TEMPERATURE) {
					topicMessage = "low_temp"
					var message = temperature + "C° " + (temperature * 1.8 + 32) + "F°"
					send_to_four_topic_mqtt(COVER_TOPIC, LIGHT_TOPIC, PHONE_TOPIC, PHONE_TOPIC, topicMessage, topicMessage, topicMessage, message)
					context.callback("feedback {temperature: " + temperature + ", cover: " + cover + ", light: " + power + "}")

				}
				if (temperature > MIN_TEMPERATURE) {
					var message = temperature + "C° " + (temperature * 1.8 + 32) + "F°"
					topicMessage = "high_temp"
					send_to_four_topic_mqtt(COVER_TOPIC, LIGHT_TOPIC, PHONE_TOPIC, PHONE_TOPIC, topicMessage, topicMessage, topicMessage, message)
					context.callback("feedback {temperature: " + temperature + ", cover: " + cover + ", light: " + power + "}")
				}

			} else if (_data.indexOf("Time") != -1) {
				var currentTime =new Date("01/01/2011 " + _data.substr(_data.indexOf(":")+1,) + ":00");
				if (openHour < currentTime && closeHour > currentTime) {
					topicMessage = "cover_off"
					send_to_three_topic_mqtt(COVER_TOPIC, LIGHT_TOPIC, PHONE_TOPIC, topicMessage, topicMessage, topicMessage)
					context.callback("feedback {temperature: " + temperature + ", cover: " + cover + ", light: " + power + "}")
				} else {
					topicMessage = "cover_on"
					send_to_three_topic_mqtt(COVER_TOPIC, LIGHT_TOPIC, PHONE_TOPIC, topicMessage, topicMessage, topicMessage)
					context.callback("feedback {temperature: " + temperature + ", cover: " + cover + ", light: " + power + "}")
				}

			}
			break;
	}


}


