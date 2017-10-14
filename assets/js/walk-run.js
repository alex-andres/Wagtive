var map, infoWindow;
var marker;
var path = "";
var coordArray = [];
var trackBol;
var interval;
var coordMinusArray = [];
var outputDiv = document.getElementById('output');
var distance;
var totalDistance;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 34.052235, lng: -118.243683 },
		zoom: 9
	});
	infoWindow = new google.maps.InfoWindow;

	function setMarkerPosition(marker, position) {
		marker.setPosition(
			new google.maps.LatLng(
				position.coords.latitude,
				position.coords.longitude)
		);
	};

	function showLocation(position) {
		var i = 0;
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var coords = { lat: lat, lng: lng };
		coordArray.push(coords);

		setMarkerPosition(marker, position);
		console.log(lat);
		console.log(lng);
		console.log(coordArray);

		$("#output").html(coords);
		i++;
		if (coordArray.length > 1) {
			distanceCalc();
		}
	};

	function errorHandler(err) {
		if (err.code == 1) {
			alert("Error: Access is denied!");
		} else if (err.code == 2) {
			alert("Error: Position is unavailable!");
		}
	};

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
	var geocoder = new google.maps.Geocoder;


	function distanceCalc() {
		var i = 1;
		// var distance = results[j].distance.text;
		var service = new google.maps.DistanceMatrixService;
		service.getDistanceMatrix({
			origins: [coordArray[i - 1]],
			destinations: [coordArray[i]],
			travelMode: 'WALKING',
			unitSystem: google.maps.UnitSystem.IMPERIAL,
			avoidHighways: true,
			avoidTolls: true,
		}, function(response, status) {
			if (status !== 'OK') {
				alert('Error was: ' + status);
			} else {
				var originList = response.originAddresses;
				var destinationList = response.destinationAddresses;
				outputDiv = document.getElementById('output');
				outputDiv.innerHTML = '';


				for (var i = 0; i < originList.length; i++) {
					var results = response.rows[i].elements;
					geocoder.geocode({ 'address': originList[i] }, );
					for (var j = 0; j < results.length; j++) {
						geocoder.geocode({ 'address': destinationList[j] }, );
						distance = results[j].distance
						console.log(distance.value);
					};
					console.log(distance);
					distance += distance;
				}
			}
			console.log(distance);
		});
		i++;
	};
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
};