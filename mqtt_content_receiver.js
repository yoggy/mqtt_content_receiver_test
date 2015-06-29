//
//  mqtt_content_receiver.js
//
//  github:
//      https://github.com/yoggy/mqtt_content_receiver_test
//
//  license:
//      Copyright (c) 2015 yoggy <yoggy0@gmail.com>
//      Released under the MIT license
//      http://opensource.org/licenses/mit-license.php;
//
function MQTTContentReceiver(url, topic, target_elem, disconnectHandler) {
	this.url = url;
	this.topic = topic;
	this.target_elem = target_elem;
	this.disconnectHandler = disconnectHandler;
	this.clientID = "MQTTContentReceiver-" + (new Date()).getTime();
	this.client = null;
}

MQTTContentReceiver.prototype.onConnectionLost = function(err) {
	if (err.errorCode !== 0) {
	    this.disconnectHandler(err);
	}
}

MQTTContentReceiver.prototype.onFailure = function(err) {
    this.disconnectHandler(err);
}

MQTTContentReceiver.prototype.onConnect = function() {
	this.client.subscribe(this.topic);
}

MQTTContentReceiver.prototype.onMessageArrived = function(message) {
	this.target_elem.html(message.payloadString);
}

MQTTContentReceiver.prototype.send = function(topic, text) {
	var msg = new Paho.MQTT.Message(text);
	msg.destinationName = topic;
	this.client.send(msg);
}

MQTTContentReceiver.prototype.connect = function() {
	var that = this;

	// parse url string
	var url = document.createElement('a');
	url.setAttribute('href', this.url);

	console.log("MQTTContentReceiver.connect() : hostname=" + url.hostname + ", port=" + (Number(url.port)||80) + ", pathname=" + url.pathname);

	this.client = new Paho.MQTT.Client(
		url.hostname,
		Number(url.port)||80,
		url.pathname,
		this.clientID);

	this.client.onConnectionLost = function(err) {
		that.onConnectionLost.call(that, err)
	};

	this.client.onMessageArrived = function(msg) {
		that.onMessageArrived.call(that, msg)
	};

	this.client.connect({
		timeout : 30,
		mqttVersion : 3,
		cleanSession : true,
		onSuccess : function() {that.onConnect.call(that)},
		onFailure : function(err) {that.onFailure.call(that, err)}
	});
}

MQTTContentReceiver.prototype.disconnect = function() {
	this.client.disconnect();
}
