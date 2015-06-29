var client = null;

function onDisconnect(err) {
	console.log("onDisconnect");
	setGUIStatus(false);
}

function setGUIStatus(flag) {
	if (flag) {
		$("#form_area").css("display", "none");
		$("#content_area").css("display", "inline");
	}
	else {
		$("#form_area").css("display", "inline");
		$("#content_area").css("display", "none");
	}
}

function connect() {
	console.log("connect...");

	var url = "ws://mqtt-test.local/ws";
	var topic = "test_topic";

	client = new MQTTContentReceiver(url, topic, iframe_body, onDisconnect);
	client.connect();
}

function disconnect() {
	console.log("disconnect...");
	client.disconnect();
}

$(document).ready(function() {
	iframe_body = $('#content_iframe').contents().find("body");

	$("#button_connect").click(function() {
		setGUIStatus(true);
		connect();
	});

	$(document).keyup(function(e) {
	  if (e.keyCode == 27) disconnect();
	});

	setGUIStatus(false);
});