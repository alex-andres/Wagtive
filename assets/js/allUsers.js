$(document).ready(function() {

    firebase.auth().onAuthStateChanged(user => {

        if (user) {

            db.ref().child('users/').on('child_added', function(snapshot) {

                console.log(snapshot.val())

                if (user.uid !== snapshot.val().uid) {

                    var newDiv = $('<div class="profIcon">');
                    newDiv.attr('data-attr', snapshot.val().uid)

                    var newName = $('<h3>').text(snapshot.val().firstName)
                    var newLevel = $('<p>').text(snapshot.val().level)
                    var newPic = $('<img class="profPic">').attr('src', snapshot.val().profilePic)
                    var newLocation = $('<h6>').text(snapshot.val().hTown)

                    newDiv.append(newName)
                    newDiv.append(newLevel)
                    newDiv.append(newPic)
                    newDiv.append(newLocation)


                    $('#allUsers').append(newDiv)

                }

            });


            $(document).on('click', '.profIcon', function() {
                var otherUser = $(this).attr('data-attr')

                db.ref('users/' + user.uid + '/otherUser').set({
                    otherUser: otherUser
                });

                location.replace('other-user.html')
            })



        } else {
            location.replace('index.html')
        }

    })

})