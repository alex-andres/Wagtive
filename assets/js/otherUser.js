$(document).ready(function() {

    firebase.auth().onAuthStateChanged(user => {

        if (user) {

            var uid = user.uid;
            var activities;
            var points;
            var nextLevel;

            db.ref('users/' + uid + '/otherUser').once('value', snapshot => {

                //FILLS OUT USERS PROFILE
                var otherUser = snapshot.val().otherUser

                db.ref('users/' + otherUser).once('value', snapshot => {

                    var userFirst = snapshot.val().firstName;
                    var userLast = snapshot.val().lastName;
                    var email = snapshot.val().email;
                    var hTown = snapshot.val().hTown;
                    var petName = snapshot.val().petName;
                    var photo = snapshot.val().profilePic;
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


                    $('#profileImage').attr('src', photo);


                    var activityRef = db.ref('users/' + otherUser + '/activities');

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

                })

            })

        } else {
            location.replace('index.html')
        }

    })
})