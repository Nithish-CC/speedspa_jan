setInterval(showMomentTime, 100, true);

function showMomentTime() {
    var CurrentDateAndTime = moment().format('dddd, MMMM Do YYYY, hh:mm:ss A')
    var clickElement = document.getElementById("clock");
    if (clickElement) {
        clickElement.innerHTML = CurrentDateAndTime;
    }
}

function showTime() {
    var time = new Date();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    am_pm = "AM";

    if (hour > 12) {
        hour -= 12;
        am_pm = "PM";
    }
    if (hour == 0) {
        hr = 12;
        am_pm = "AM";
    }

    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    var currentTime = hour + ":"
        + min + ":" + sec + am_pm;

    document.getElementById("clock")
        .innerHTML = currentTime;
}
