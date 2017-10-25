$(document).ready(function() {

    firebase.auth().onAuthStateChanged(user => {

        if (user) {

            db.ref().child('users/').orderByChild('points').on('child_added', function(snapshot) {

                var newRow = $('<tr>');
                var newName = $('<td>').text(snapshot.val().firstName).addClass("text-center");
                var newLevel = $('<td>').text(snapshot.val().level).addClass("text-center");
                var newScore = $('<td>').text(snapshot.val().points).addClass("text-center");
                newRow.append(newName).append(newLevel).append(newScore);

                $('#LeaderboardInformation').prepend(newRow);
            }) //end db.ref()  
        
    } else {
            location.replace('index.html')
        }

    }) //end firebase.auth


})