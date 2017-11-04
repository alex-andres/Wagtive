$(function() {

    var long = 0;
    var latt = 0;
    var bolLoaded = false;

    $(".checkInButton").on("click", function(event) {

        if (!bolLoaded) {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                $("#check-ins-modal").html("<span>Geolocation is not supported by this browser.</span>");
            }

            function error(e) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        $("#check-ins-modal").html("<span>You denied the request for Geolocation, please refresh the page.</span>");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        $("#check-ins-modal").html("<span>Your location information is unavailable.</span>");
                        break;
                    case error.TIMEOUT:
                        $("#check-ins-modal").html("<span>The request to get your location timed out.</span>");
                        break;
                    case error.UNKNOWN_ERROR:
                        $("#check-ins-modal").html("<span>An unknown error occurred.</span>");
                        break;
                }
            }

            function success(position) {
                long = position.coords.longitude;
                latt = position.coords.latitude;

                $.getJSON(`https://api.wagtive.com/?latitude=${latt}&longitude=${long}`, { method: "GET" })
                    .done(function(response) {

                        $("#check-ins-modal").html("");

                        for (var i = 0; i < 7; i++) {
                            var div1 = $('<div>').addClass("col-2 col-md-2 pr-0");
                            var div2 = $('<div>').addClass("col-7 col-md-8 pr-0 pr-md-1");
                            var div3 = $('<div>').addClass("col-3 col-md-2");
                            var result_img = $('<img>').addClass("checkInImage").attr("src", response.businesses[i].image_url);
                            div1.append(result_img);
                            var inf1 = $('<span>').addClass("font-weight-bold").after("<br>");
                            var inf2 = $('<span>').addClass("py-0").html("<br>");
                            var inf3 = $('<span>').prepend("<br>");
                            inf1.append(response.businesses[i].name);
                            inf2.append(response.businesses[i].location.display_address[0] + " " + response.businesses[i].location.display_address[1]);
                            inf3.append(" Rating: " + response.businesses[i].rating);
                            div2.append(inf1).append(inf2).append(inf3);
                            var btn = $("<button>").addClass("btn btn-outline-secondary").text("Check in");
                            div3.append(btn);
                            var result_container_div = $("<div>").addClass("row align-items-center justify-content-around").css("margin-bottom", "20px");
                            result_container_div.append(div1).append(div2).append(div3);
                            $("#check-ins-modal").append(result_container_div);
                        }

                        bolLoaded = true;
                    })
            }
        };
    })
});