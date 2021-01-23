if (screen.width <= 800) {
	var err_params = {
	status_code :  401, 
	message :  "Please try again with a device with bigger screen.", 
	hideButton  : true }
	var rdurl = `err/?${jQuery.param(err_params)}`
  location.replace(rdurl);
}

startup()
showLoading(1)

function hideLoader() {
document.getElementById("loader").style = "visibility: hidden";
document.getElementById("full").style = "visibility: visible";
}

function showLoading(secs){
	secs += 1;
		document.getElementById("loader").style = "visibility: visible";
		document.getElementById("full").style = "visibility: hidden";
	setTimeout(function () {
		document.getElementById("loader").style = "visibility: hidden";
	}, secs+2.5*1000)
	setTimeout(function() {
		document.getElementById("full").style = "visibility: visible";
	}, secs+3*1000)
}

async function startup() {
	var urlParams = new URLSearchParams(window.location.search);
	var send_date = urlParams.get("d");
	if (send_date == null || send_date == "") {
		var jsDate = new Date();
    var dd = String(jsDate.getDate()).padStart(2, "0");
    var mm = String(jsDate.getMonth() + 1).padStart(2, "0");
    var yyyy = String(jsDate.getFullYear());
    var send_date = `${yyyy}-${mm}-${dd}`;
    var read_date = `${dd}-${mm}-${yyyy}`;
} else {
	var send_date = urlParams.get("d");
    var dd = send_date.slice(8);
    var mm = send_date.slice(5, 7);
    var yyyy = send_date.slice(0, 4);
    var read_date = `${dd}-${mm}-${yyyy}`;
}
	var response = await fetch(`https://api.nasa.gov/planetary/apod?thumbs=true&api_key=DEMO_KEY&date=${send_date}`
  );
	var vars = await response.json()
	if (!response.ok || response.status != 200 || response.statusText != "OK") {
		var params = {};
		params.status_code = response.status;
		params.status_text = response.statusText;
		params.message  = vars.msg;
		var redirect_url = `err/?${jQuery.param(params)}`;
		location.replace(redirect_url);
	}
	if (vars.media_type != "video") {
		document.querySelector("#main_image").src = vars.hdurl;
		document.querySelector("#load_img").src = "imgs/loading.gif";		
		document.querySelector("#main_image").onload = function() {
			document.querySelector("#load_img").style.display = "none";
			document.querySelector("#waiting").style.display = "none";
			document.querySelector("#main_image").style.display = "flex";
			document.querySelector("#main_image").src = vars.hdurl;
		};
		document.querySelector("#image_anchor").href = vars.hdurl;
		document.querySelector("#video_container").style.display = "none";
	}
	else {
		document.querySelector("#load_img").style.display = "none";
		document.querySelector("#waiting").style.display = "none";
		document.getElementById("image_anchor").style.display = "none";
		document.getElementById("main_image").style.display = "none";
		document.getElementById(
      "video_container"
	).innerHTML = `<iframe width="1366" height="625" src="${vars.url}" allowfullscreen></iframe>`;
	}
	document.getElementById("date").innerHTML = read_date;
	document.getElementById("img_title").innerHTML = vars.title;
	document.getElementById("explanation").innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${vars.explanation}`;
	var cpright = vars.copyright;
	if (cpright == undefined) {
		cpright = "National Aeronautics and Space Administration (NASA)";
	}
	document.getElementById("copyright").innerHTML = `${yyyy} ${cpright}`;
}
