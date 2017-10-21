$(document).ready(function() {

    // SIGN IN WITH EMAIL AND PASSWORD

    $("#signIn").on("click", e => {
        e.preventDefault();
        const email = $("#inputEmail").val().trim();
        const password = $("#inputPassword").val().trim();

        const promise = auth.signInWithEmailAndPassword(email, password).then(function() {
            location.replace('home.html');
        });
        promise.catch(e => console.log(e.message));

    })

    // REGISTER NEW USER WITH EMAIL AND PASSWORD

    $("#modalSignup").on("click", e => {
        e.preventDefault();

        firstName = $("#modalFName").val().trim();
        lastName = $("#modalLName").val().trim();
        email = $("#modalEmail").val().trim();
        password = $("#modalPassword").val().trim();
        password2 = $("#modalPassword2").val().trim();
        hTown = $("#modalHTown").val().trim();
        petName = $("#modalPName").val().trim();

        if (password !== password2) {

            $("#passwdValid").removeClass('d-none');
        } else {


            const promise = auth.createUserWithEmailAndPassword(email, password).then(function(user) {


                db.ref('users/' + user.uid).set({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    hTown: hTown,
                    petName: petName,
                    points: 300,
                    level: 'Puppy',
                    activities: 0,
                });

                // STORES ADDITIONAL DATA FROM REGISTRATION FORM


                // SEND VERIFICATION EMAIL

                firebase.auth().onAuthStateChanged(user => {
                    const promise = user.sendEmailVerification().then(function() {
                        console.log("Verification email sent");

                        var photoUrl = 'assets/images/profile.jpg';

                        user.updateProfile({
                            photoURL: photoUrl
                        });

                        $("#signupModal").toggle();


                    });

                })

            });
            promise.catch(e => console.log(e.message));
        }
    });

    // LOGOUT

    $("#logout").on("click", e => {
        auth.signOut();
    })
})