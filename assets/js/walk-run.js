console.log("walk-run.js is loaded!");
var map, infoWindow;
var marker;
var path = "";
var coordArray = [];
var trackBol;
var interval;
var outputDiv = document.getElementById('output');
var distance = 0;
var totalDistance = 0;
var lat1 = 0;
var lng1 = 0;
var lat2 = 0;
var lng2 = 0;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		//center: { lat: 34, lng: -118 },
		center: { lat: 34.052235, lng: -118.243683 },
		zoom: 13
	});
	infoWindow = new google.maps.InfoWindow;

	function setMarkerPosition(marker, position) {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		map.setCenter(pos);
		marker.setPosition(
			new google.maps.LatLng(
				position.coords.latitude,
				position.coords.longitude)
		);
	};
	/*computes current location, pushes the coordinates to an array for future drawing use, 
	stores the newest coordinates in initial variable, when next coordinates are calculated stores previous coordinates in lat2 lng2,
	stores newest coordinates in lat1 lng1.
	*/
	function showLocation(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		setMarkerPosition(marker, position);
		storeNewCoord(lat, lng);
		if (lat1 === 0){
			lat1 = parseFloat(lat);
			lng1 = parseFloat(lng);
		}
		else {
			lat2 = parseFloat(lat1);
			lng2 = parseFloat(lng1);
			lat1 = parseFloat(lat);
			lng1 = parseFloat(lng);
			console.log(lat1, lng1, lat2, lng2)
			getDistanceFromLatLon(lat1, lng1, lat2, lng2);

			var PathStyle = new google.maps.Polyline({
			  path: coordArray,
			  strokeColor: "#FF0000",
			  strokeOpacity: 1.0,
			  strokeWeight: 2
			});

			PathStyle.setMap(map);
		}

	};

	//function that will allow us to draw lines with previous coordinates
	function storeNewCoord(lat, lng) {
		var coord = "new google.maps.LatLng(" + lat.toString() + ", " + lng.toString() + ")";
		coordArray.push(coord);
	};

	//function that calculates distance using great circle method (arc instead of flat line)
	function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
	  var R = 3959; // Radius of the earth in miles
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1); 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in miles
	  distance += d;
	  totalDistance = distance.toFixed(2);
	  $("#distanceOutput").html("<h4>" + totalDistance + "</h4>");
	};
	//function that converts degs to radians
	function deg2rad(deg) {
	  return deg * (Math.PI/180)
	};

	function errorHandler(err) {
		if (err.code == 1) {
			alert("Error: Access is denied!");
		} else if (err.code == 2) {
			alert("Error: Position is unavailable!");
		}
	};
	var PathStyle = new google.maps.Polyline({
    path: coordArray,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

// -------------- Timer code [START] ---------------------------------

		var timer = new Timer();
		$('#startButton').click(function () {

			var state = $(this).attr("data-status");
			//Start the time from the initial state.
			if(state == 'btn-start-initial' ){
				//set the data status to start
				//Change start button to pause
				//Start the timer
				//start google maps
				//Add pause button
				$('#startButton').text('Pause').addClass('pauseButton');
				$('#startStopPauseButtonGroup').append(
					"<div class='col-6'><button id='stopButton' class='btn btn-custom mt-3 mt-md-2' data-status='btn-stop-initial'" +
					" data-target='#timerModal' data-toggle='modal' submit'>Stop</button></div>");

				timer.start();
				googleMaps();
				$(this).attr("data-status",'btn-pause-start');
				//Stop button modal
				$('#stopButton').click(function () {
					timer.pause();
				}).addClass('stopButton');

			}
			//Pausing time in the start state
			if(state == 'btn-pause-start') {
				$('#startButton').text('Start').removeClass('pauseButton').addClass('startButton');
				timer.pause();
				$(this).attr("data-status", 'btn-start-pause');
			}

			//Restarting from pause state
			if(state == 'btn-start-pause'){
				timer.start(); //Without start google maps
				$('#startButton').text('Pause').addClass('pauseButton').removeClass('startButton');
				//set the data status to stop
				//Start the timer
				$(this).attr("data-status",'btn-pause-start');

			}
			//Resume the time
			if(state == 'pause'){
				console.log("Data status is: " , state);
			}
		});

		$('#stopButton').click(function () {
			console.log("you clicked the stop button!");
			timer.stop();
		});

		timer.addEventListener('secondsUpdated', function (e) {
			$('#txt_Timer .timerValues').html("<h4 class='timer'>" + timer.getTimeValues().toString() + "</h4>");
		});
		timer.addEventListener('started', function (e) {
			$('#txt_Timer .timerValues').html("<h4 class='timer'>" + timer.getTimeValues().toString() + "</h4>");
		});
		timer.addEventListener('reset', function (e) {
			$('#txt_Timer .timerValues').html("<h4 class='timer'>" + timer.getTimeValues().toString() + "</h4>");
		});
		//------------------------------------Modals [START]------------------------------------
		$('#modal_Yes').click(function(){
			//Save the times and store in database.
			$('#timerModal').modal('hide');
			location.reload();
			//resetTimer();
			timer.stop();
		});
		$('#modal_No').click(function(){
			$('#timerModal').modal('hide');
			timer.start();
		});
		//------------------------------------Modals [STOP]------------------------------------

		/*timer.addEventListener('targetAchieved', function (e) {
		 console.log("THE EVENT IS COMPLETE!!!!!!!");
		 });*/

		function resetTimer(){
			$('#txt_Timer .timerValues').html('<h4 class="timer">00:00:00</h4>');
			$('#startButton').attr('data-status', 'btn-start-initial').text();
			$('#startButton').text('Start').removeClass('pauseButton').addClass('startButton');


		}
	// -------------- Timer code [STOP]---------------------------------


	//-------------- Google Map code [START] ---------------------------
	function googleMaps(){
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (width <= 414) {
        var zoom = 17;
    } else {
        var zoom = 13;
    };

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				map.setCenter(pos);
				map.setZoom(zoom);
				var options = {
					enableHighAccuracy: true,
					timeout: Infinity,
					maximumAge: 0
				};
				marker = new google.maps.Marker({
					position: pos,
					map: map,
					icon: "./assets/images/paw.png"
				});
				watchID = navigator.geolocation.watchPosition(showLocation, errorHandler, options);
			}, function() {
				handleLocationError(true, infoWindow, map.getCenter());
			});
		} else {
			// Browser doesn't support Geolocation
			handleLocationError(true, infoWindow, map.getCenter());
		}

	}
	//-------------- Google Map code [STOP] ---------------------------



};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
};