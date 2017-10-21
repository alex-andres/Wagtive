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
		center: { lat: 34.052235, lng: -118.243683 },
		zoom: 13
	});
	infoWindow = new google.maps.InfoWindow;

	function setMarkerPosition(marker, position) {
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

	$("#start").on("click", function(e) {
		e.preventDefault();
		var sec1 = 0;
		var sec2 = 0;
		var min = 0;
		var timer = setInterval(function(){
			sec1++;
			if (sec1 < 10) {
				$(".timer").html(`0${min}:${sec2}${sec1}`);
			}
			else if (sec1 === 10) {
				sec2++;
				sec1 = 0;
				if (sec2 < 6) {$(".timer").html(`0${min}:${sec2}${sec1}`)}
				else if (sec2 >= 6) {
					sec2 = 0;
					min++;
					$(".timer").html(`0${min}:${sec2}${sec1}`)
				}
			}
		}, 1000);
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				map.setCenter(pos);
				map.setZoom(14);
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
	});

	$("#stop").on("click", function(e) {
		e.preventDefault();
		trackBol = true;
	});



};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
};