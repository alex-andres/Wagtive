var map;

function initMap() {
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (width <= 414) {
        var zoom = 13;
    } else {
        var zoom = 15;
    }
    console.log(width)
    map = new google.maps.Map(document.getElementById('recent-checkins'), {
        zoom,
        center: new google.maps.LatLng(34.052248, -118.443421),
        mapTypeId: 'roadmap'
    });

    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        paw: {
            icon: './assets/images/paw.png'
        },
    };

    var features = [{
        position: new google.maps.LatLng(34.0384586, -118.4425915),
        type: 'paw'
    }, {
        position: new google.maps.LatLng(34.0482918, -118.4381352),
        type: 'paw'
    }, {
        position: new google.maps.LatLng(34.0460812, -118.4521284),
        type: 'paw'
    }, {
        position: new google.maps.LatLng(34.0574848, -118.4447802),
        type: 'paw'
    }, {
        position: new google.maps.LatLng(34.0448891, -118.4452972),
        type: 'paw'
    }, ];

    // Create markers.
    features.forEach(function(feature) {
        var marker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map
        });
    });
};

$(document).ready(function() {

    $.getScript("my_lovely_script.js", function() {

        alert("Script loaded but not necessarily executed.");

    });

    $("#infoTooltip").hover(function() {
            $('[data-toggle="tooltip"]').tooltip("show")
        },
        function() {
            $('[data-toggle="tooltip"]').tooltip("hide")
        })






    firebase.auth().onAuthStateChanged(user => {
        // CHECK IF USER IS SIGNED IN
        if (user) {
            // CHECK IF SIGNED IN USERS EMAIL IS VERIFIED
            if (user.emailVerified) {

                var uid = user.uid;
                var activities;
                var points;
                var nextLevel;

                db.ref('users/' + uid).once('value', snapshot => {

                    //FILLS OUT USERS PROFILE

                    var userFirst = snapshot.val().firstName;
                    var userLast = snapshot.val().lastName;
                    var email = snapshot.val().email;
                    var hTown = snapshot.val().hTown;
                    var petName = snapshot.val().petName;
                    points = snapshot.val().points;
                    activities = snapshot.val().activities;
                    var level;

                    if (points < 1000) {
                        level = "Puppy";
                        nextLevel = 1000;
                    } else if (points < 2000) {
                        level = "Lap Dog";
                        nextLevel = 2000;
                    } else if (points < 3000) {
                        level = "Tail Wagger";
                        nextLevel = 3000;
                    } else if (points < 4000) {
                        level = "Lively Pooch";
                        nextLevel = 4000;
                    } else if (points < 5000) {
                        level = "Sporty Hound";
                        nextLevel = 5000;
                    } else if (points > 5001) {
                        level = "Alpha Dog";
                    };

                    $('#nameSpan').text(userFirst + ' ' + userLast)
                    $('#level').text(' ' + level)
                    $('#points').text(' ' + points)

                    var progressPerct = ((points / nextLevel) * 100);


                    var bar1 = new ldBar("#progress", {
                        "stroke-width": 10,
                        "stroke": 'data:ldbar/res,gradient(0,1,#007A00,#00D700)',
                        "preset": 'circle'
                    });

                    var bar2 = document.getElementById('progress').ldBar;
                    bar1.set(progressPerct);




                })

                $('#profileImage').attr('src', user.photoURL);


                // db.ref('users/' + uid + '/activities').push(
                //     {
                //         date: '09/20/17',
                //         activityType: "Check-In",
                //         location: 'Healthy Spot' ,
                //         points: 100,
                //         distance: ""
                //     })


                var activityRef = db.ref('users/' + uid + '/activities');

                activityRef.orderByChild('date').limitToLast(10).on('child_added', function(snapshot) {
                    var newRow = $('<tr>')

                    var newDate = $('<td>').text(snapshot.val().date)
                    var newActivity = $('<td>').text(snapshot.val().activityType)
                    var newLocation = $('<td>').text(snapshot.val().location)
                    var newDistance = $('<td>').text(snapshot.val().distance)
                    var newPoints = $('<td>').text(snapshot.val().points)


                    newRow.append(newDate);
                    newRow.append(newActivity);
                    newRow.append(newLocation);
                    newRow.append(newDistance);
                    newRow.append(newPoints);


                    $('#activities').prepend(newRow);


                })

                var checkinRef = db.ref('users/' + uid + '/activities');

                checkinRef.orderByChild('date').limitToLast(10).on('child_added', function(snapshot) {
                    var newRow = $('<tr>')

                    var newDate = $('<td>').text(snapshot.val().date)
                    var newLocation = $('<td>').text(snapshot.val().location)
                    var newPoints = $('<td>').text(snapshot.val().points)

                    newRow.append(newDate);
                    newRow.append(newLocation);
                    newRow.append(newPoints);


                    $('#checkins').prepend(newRow);


                })





            } else {

                console.log("email not verified");
            }
        } else {

            //IF NOT LOGGED IN RETURN TO INDEX

            location.replace('index.html');
        }
    })

})