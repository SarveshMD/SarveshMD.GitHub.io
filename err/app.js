
var errors = {
	"400" : "Bad Request",
	"401" : "Unauthorized",
	"403" : "Forbidden",
	"404" : "Not Found",
	"429" : "Too Many Requests",
	"500" : "Internal Server Error",
};
var inrHTML = "";
var additional_message;
var urlParams = new URLSearchParams(window.location.search);
var status_code = urlParams.get("status_code");
var status_text = errors[status_code]
var hideButton  = urlParams.get("hideButton")
var message = urlParams.get("message");

if (status_text == undefined) {
	var status_text = urlParams.get("status_text");
}

if (message == undefined || message == "") {
	message = "Your request could not be satisfied"
}

if (status_code == "429") {
	message = "You have reached the maximum requests you can make per hour."
	var additional_message = " Please try again in an hour."
}

inrHTML += "<h1>Aww, That's an error !<h1>";
if (status_text == null || status_text == "") {
	var status_text = errors['status_code'];
	if (status_text == undefined) {
		status_code = "500"
		status_text = "Unknown Error"
	}
	}
inrHTML += `<h2>${status_code} ${status_text}</h2>`
inrHTML += `<h2>${message}</h2>`;

if (additional_message != undefined) {
	inrHTML += `<h2>${additional_message}</h2>`
	console.log(additional_message)
}

inrHTML += `<button id="back">Back</button>`;

document.getElementById("content").innerHTML = inrHTML;

document.getElementById("back").addEventListener("click", function() {
	location.replace("/")
})
if (hideButton == "true") {
	document.getElementById("back").style.display = "none";
}