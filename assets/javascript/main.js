// alert("TEST");
//Initialize firebase
var config = {
    apiKey: "AIzaSyAU8mKpW69RNZlb6qvPRQ2kgG1JHUmpFcc",
    authDomain: "train-scheduler-42b16.firebaseapp.com",
    databaseURL: "https://train-scheduler-42b16.firebaseio.com",
    projectId: "train-scheduler-42b16",
    storageBucket: "train-scheduler-42b16.appspot.com",
    messagingSenderId: "400443164791"
};

//add Firebase config 
firebase.initializeApp(config);

//variable for the database
var database = firebase.database();

//firebase variables
var trainName = "";
var destination = "";
var frequency = "";
var firstTrain = "";
var firstTrainUnix = "";

// click button function
$("#addTrain").on("click", function (event) {
    //no refresh of page
    event.preventDefault();

    //Notify use that train was succesfully added
    alert("Train has been added");

    //Retrieving stored values from each...
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    frequency = parseInt($("#frequency").val().trim())
    firstTrain = $("#first-train").val().trim();

    //Convert time from user input to unix time
    firstTrainUnix = moment(moment(firstTrain, "hh:mm")).format("X");


    database.ref().push({

        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTrainUnix: firstTrainUnix,
        dateAdded: firebase.database.ServerValue.TIMESTAMP

    });


    document.getElementById("form-1").reset();

});

database.ref().on("child_added", function (childSnapshot) {

    //console.log for each value
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainUnix);
    console.log(childSnapshot.val().frequency);
    console.log(childSnapshot.val().dateAdded);

    //Convert variable firstTrain to UNIX time
    var firstTrain = moment.unix(firstTrainUnix).format();

    var firsttArrivalConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(firsttArrivalConverted);

    //Pulled from firebase
    var frequency = childSnapshot.val().frequency;

    //Variable for current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment().format("hh:mm"));

    //variable for time difference
    var diffTime = moment().diff(moment(firsttArrivalConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);


    var tRemainder = diffTime % frequency;
    console.log("REMAINDER: " + tRemainder);

    //Minutes away
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    //Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var arr = moment(nextTrain).format("hh:mm")

    //print to HMTL
    $("tbody").append(
        "<tr><td>" + childSnapshot.val().trainName + "</td>" +
        "<td>" + childSnapshot.val().destination + "</td>" +
        "<td>" + childSnapshot.val().frequency + "</td>" +
        "<td>" + arr + "</td>" +
        "<td>" + tMinutesTillTrain + "</td></tr>"
    );

    // function to handle errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

});

//clock parameters
$(function () {

    var clock = $('#clock'),
        alarm = clock.find('.alarm'),
        ampm = clock.find('.ampm');


    var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');

    //placeholder for numbers
    var digits = {};

    //variable for time positions
    var positions = [
        'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
    ];

    var digit_holder = clock.find('.digits');

    $.each(positions, function () {

        if (this == ':') {
            digit_holder.append('<div class="dots">');
        }
        else {
            var pos = $('<div>');

            for (var i = 1; i < 8; i++) {
                pos.append('<span class="d' + i + '">');
            }

            // Set the digits as key:value pairs in the digits object
            digits[this] = pos;

            // Add the digit elements to the page
            digit_holder.append(pos);
        }

    });
        //variable for the weekday names
        var weekday_names = 'MON TUE WED THU FRI SAT SUN'.split(' '),
        weekday_holder = clock.find('.weekdays');

    $.each(weekday_names, function () {
        weekday_holder.append('<span>' + this + '</span>');
    });

    var weekdays = clock.find('.weekdays span');

    //function to update the time
    (function update_time() {

        //moment.js function
        var now = moment().format("hhmmssdA");

        digits.h1.attr('class', digit_to_name[now[0]]);
        digits.h2.attr('class', digit_to_name[now[1]]);
        digits.m1.attr('class', digit_to_name[now[2]]);
        digits.m2.attr('class', digit_to_name[now[3]]);
        digits.s1.attr('class', digit_to_name[now[4]]);
        digits.s2.attr('class', digit_to_name[now[5]]);

       //moving sunday to the last day of the week
        var dow = now[6];
        dow--;

        // Sunday!
        if (dow < 0) {
            // Make it last
            dow = 6;
        }

        // Mark the active day of the week
        weekdays.removeClass('active').eq(dow).addClass('active');

        // Set the am/pm text:
        ampm.text(now[7] + now[8]);

        // Schedule this function to be run again in 1 sec
        setTimeout(update_time, 1000);

    })();

});