    // Initialize Firebase

    var config = {
        apiKey: "AIzaSyBH-OgVkuMyOaep8meq0FJD1RxavuIlXlY",
        authDomain: "wagtive.firebaseapp.com",
        databaseURL: "https://wagtive.firebaseio.com",
        projectId: "wagtive",
        storageBucket: "wagtive.appspot.com",
        messagingSenderId: "248580578313"
    };
    firebase.initializeApp(config);

    const db = firebase.database();
    const auth = firebase.auth();

    var firstName;
    var lastName;
    var email;
    var password;
    var hTow;
    var petName;

    var user;

    $("#infoTooltip").hover(function () {
        $('[data-toggle="tooltip"]').tooltip("show")
    },
    function () {
        $('[data-toggle="tooltip"]').tooltip("hide")
    })