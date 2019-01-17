// Initialize Firebase

var config = {
    apiKey: "AIzaSyCw7hB7UoQQRk_-ZVm3uyxB0ybPz5WIKaM",
    authDomain: "wagtive-ec4ee.firebaseapp.com",
    databaseURL: "https://wagtive-ec4ee.firebaseio.com",
    projectId: "wagtive-ec4ee",
    storageBucket: "wagtive-ec4ee.appspot.com",
    messagingSenderId: "1082781691019"
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