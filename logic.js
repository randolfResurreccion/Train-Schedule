
var config = {
    apiKey: "AIzaSyCCVuXpn7Fmu0zvOC-NldIl4NR7ZPeRHpc",
    authDomain: "train-schedule-99af3.firebaseapp.com",
    databaseURL: "https://train-schedule-99af3.firebaseio.com",
    projectId: "train-schedule-99af3",
    storageBucket: "train-schedule-99af3.appspot.com",
    messagingSenderId: "719578964526"
};
firebase.initializeApp(config);

var database = firebase.database();

//   Initial Value

var trainName;
var destination;
var trainTime;
var freqMinute;

$("#submit").on("click", function () {
    event.preventDefault();

    trainName = $("#train-input").val().trim();
    destination = $("#destination-input").val().trim();
    trainTime = $("#time-input").val().trim();
    freqMinute = $("#frequency-input").val().trim();

    // local temporary object
    var trainData = {
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        freqMinute: freqMinute,
        timeStamp: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref().push(trainData);
//    stop refresh
    $("input").val('');
    return false;

    // logs train data to console
    console.log(trainData.trainName);
    console.log(trainData.destination);
    console.log(trainData.trainTime);
    console.log(trainData.freqMinute);

    // clear text-box
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#time-input").val();
    $("#frequency-input").val();
});

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());
    var trainName = childSnapshot.val().trainName;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().trainTime;
    var trainFrequency = childSnapshot.val().freqMinute;

    var nextArrival = 0;
    var minsAway = 0;

    console.log(trainName);
    console.log(destination);
    console.log(trainTime);
    console.log(freqMinute);

    // fix train time.. convert to mins away and next arrival

    var frequency = parseInt(trainFrequency );
    var realTime = moment();
    console.log("Real Time: " + moment().format("HH:mm"));

    var dateCon = moment(childSnapshot.val().trainTime, "HH:mm").subtract(1, "years");
    console.log(dateCon);
    var time = moment(dateCon).format('HH:mm');
    console.log(time);

    var timeCon = moment(time, "HH:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(timeCon), 'minutes');
    console.log(timeDiff);

    var timeRemain = timeDiff % trainFrequency;
    console.log(timeRemain);
    
    minsAway = trainFrequency - timeRemain;
    console.log(minsAway);

    nextArrival = moment().add(minsAway, "minutes");
    
    var trainArriving = moment(nextArrival).format("HH:mm")


    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + trainArriving + "</td><td>" + minsAway + "</td></tr>")

});
