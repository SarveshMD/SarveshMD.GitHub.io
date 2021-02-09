if (screen.width <= 800) {
	var header = document.querySelector("h1");
	var imageHeader = document.querySelector("h2");
	var openLoader = document.querySelector("#loader");
	var enterDate = document.querySelector("label");
	var image = document.querySelector("#main_image");
	var selectDate = document.querySelector("#selectdate");
	var go = document.querySelector("#go");
	var showHalf = document.querySelector("#showHalf");

	openLoader.style.width = "30%";
	openLoader.style.right = "38%";
	header.style.fontSize = "30px";
	imageHeader.style.fontSize = "25px";
	image.style.width = "100vw";
	enterDate.style.fontSize = "30px";
	enterDate.style.color = "hsl(226, 100%, 50%)";
	selectDate.style.width = "300px";
	go.style.position = "relative";
	go.style.left = "00px";
	go.style.margin = "10px 0 0 0";
	showHalf.style.margin = "10px 0 0 0";
	showHalf.style.position = "relative";
	showHalf.style.left = "0px";
	header.innerHTML += "<br>";
	var jsDate = new Date();
	var dd = String(jsDate.getDate()).padStart(2, "0");
	var mm = String(jsDate.getMonth() + 1).padStart(2, "0");
	var yyyy = String(jsDate.getFullYear());
	var send_date = `${yyyy}-${mm}-${dd}`;
	selectDate.value = send_date;
}

var seconds = 1.5;

setTimeout(function () {
	document.getElementById("loader").style.visibility = "hidden";
	document.getElementById("full").style.visibility = "visible";
	document.querySelector("body").style.overflow = "visible";
}, seconds * 1000);

startup();

async function startup() {
	var urlParams = new URLSearchParams(document.location.search);
	var send_date = urlParams.get("d");
	document.getElementById("selectdate").value = send_date;
	document.getElementById("selectdate").max = new Date().toISOString().split("T")[0];
	if (send_date == null) {
		var jsDate = new Date();
		var dd = String(jsDate.getDate()).padStart(2, "0");
		var mm = String(jsDate.getMonth() + 1).padStart(2, "0");
		var yyyy = String(jsDate.getFullYear());
		var send_date = `${yyyy}-${mm}-${dd}`;
		var read_date = `${dd}-${mm}-${yyyy}`;
		document.getElementById("selectdate").value = send_date;
		var response = await fetch(`https://api.nasa.gov/planetary/apod?thumbs=true&api_key=FW3Yre1Qb0KJCuI5xLDspAOS3oG4ddA19j7qZmsA&date=${send_date}`);
		if (response.status != 200) {
			var jsDate = new Date();
			var dd = String(jsDate.getDate() - 1).padStart(2, "0");
			var mm = String(jsDate.getMonth() + 1).padStart(2, "0");
			var yyyy = String(jsDate.getFullYear());
			var send_date = `${yyyy}-${mm}-${dd}`;
			var read_date = `${dd}-${mm}-${yyyy}`;
			var response = await fetch(`https://api.nasa.gov/planetary/apod?thumbs=true&api_key=FW3Yre1Qb0KJCuI5xLDspAOS3oG4ddA19j7qZmsA&date=${send_date}`);
		}
	} else {
		var send_date = urlParams.get("d");
		var dd = send_date.slice(8);
		var mm = send_date.slice(5, 7);
		var yyyy = send_date.slice(0, 4);
		var read_date = `${dd}-${mm}-${yyyy}`;
		var response = await fetch(`https://api.nasa.gov/planetary/apod?thumbs=true&api_key=FW3Yre1Qb0KJCuI5xLDspAOS3oG4ddA19j7qZmsA&date=${send_date}`);
	}
	var vars = await response.json();
	if (!response.ok || response.status != 200 || response.statusText != "OK") {
		var params = {};
		params.status_code = response.status;
		params.status_text = response.statusText;
		params.message = vars.msg;
		var redirect_url = `err/?${jQuery.param(params)}`;
		location.replace(redirect_url);
	}
	if (vars.media_type != "video") {
		document.getElementById("main_image").src = vars.hdurl;
		document.getElementById("load_img").src = "imgs/loading.gif";
		document.getElementById("main_image").onload = function () {
			document.getElementById("load_img").style.display = "none";
			document.getElementById("waiting").style.display = "none";
			document.getElementById("showHalf").style.display = "none";
			document.getElementById("main_image").style.display = "flex";
			document.getElementById("main_image").src = vars.hdurl;
		};
		document.getElementById("image_anchor").href = vars.hdurl;
		document.getElementById("video_container").style.display = "none";
	} else {
		document.getElementById("load_img").style.display = "none";
		document.getElementById("waiting").style.display = "none";
		document.getElementById("showHalf").style.display = "none";
		document.getElementById("image_anchor").style.display = "none";
		document.getElementById("main_image").style.display = "none";
		// document.getElementById("switch").style.display = "none";
		document.getElementById("video_container").innerHTML = `<iframe width="1366" height="625" src="${vars.url}" allowfullscreen></iframe>`;
	}
	document.querySelector("h1").innerHTML += read_date;
	document.getElementById("img_title").innerHTML = vars.title;
	var indent = "&nbsp;".repeat(13);
	document.getElementById("explanation").innerHTML = `<span id="indentExplanation">${indent}</span>${vars.explanation}`;
	var cpright = vars.copyright;
	if (cpright == undefined) {
		cpright = "National Aeronautics and Space Administration (NASA)";
	}
	document.getElementById("copyright").innerHTML += `${yyyy} ${cpright}`;
}

document.getElementById("showHalf").addEventListener("click", function () {
	document.getElementById("main_image").style.display = "inline-block";
	document.getElementById("showHalf").style.display = "none";
	document.getElementById("load_img").style.display = "none";
});

// document.getElementById("switch").addEventListener("click", function() {
//     var url = window.location.href;
//     url += "&hd=true";
//     location.replace(url);
// })
