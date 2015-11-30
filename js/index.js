var isMainTimer = true;
var timerIsntChanged = true;
var go = true;
var pausable = false;
var paused = false;
var globalTimeLeft = 0;
var looped = false;
var THEEND = 0;
var MAX = 0;

function lessTime(id) { //subtracts time
  if ((paused && pausable) || (!paused && !pausable)) {
    document.getElementById("timer").style.backgroundSize = "0% 100%";
    timerIsntChanged = false;
    go = true;
    pausable = false;
    paused = false;
    looped = false;
    var time = parseInt(document.getElementById(id).innerHTML);
    if (time > 1) {
      document.getElementById(id).innerHTML = time - 1;
      document.getElementById("Mins").innerHTML = time - 1;
      document.getElementById("Hrs").innerHTML = "";
      document.getElementById("Secs").innerHTML = "";
    }
    if (id == "break-min") {
      isMainTimer = false;
      document.getElementById("timer-label").innerHTML = "Break";
    }
    if (id == "main-min") {
      isMainTimer = true;
      document.getElementById("timer-label").innerHTML = "Main";
    }
  }
}

function moreTime(id) { //adds time
  if ((paused && pausable) || (!paused && !pausable)) {
    document.getElementById("timer").style.backgroundSize = "0% 100%";
    timerIsntChanged = false;
    go = true;
    pausable = false;
    paused = false;
    looped = false;
    
    var time = parseInt(document.getElementById(id).innerHTML);
    document.getElementById(id).innerHTML = time + 1;
    document.getElementById("Mins").innerHTML = time + 1;
    document.getElementById("Hrs").innerHTML = "";
    document.getElementById("Secs").innerHTML = "";
    if (id == "break-min") {
      isMainTimer = false;
      document.getElementById("timer-label").innerHTML = "Break";
    }
    if (id == "main-min") {
      isMainTimer = true;
      document.getElementById("timer-label").innerHTML = "Main";
    }
  }
}

function timeRemaining(endTime) { //calculates time remaining
  var timeLeft = endTime - Date.parse(new Date());
  globalTimeLeft = timeLeft;
  var hrs = Math.floor((timeLeft / (60 * 60 * 1000)));
  var mins = Math.floor((timeLeft / (60 * 1000)) % 60);
  var secs = Math.floor((timeLeft / 1000) % 60);

  return {
    's': secs,
    'm': mins,
    'h': hrs,
    'total': timeLeft
  };
}

function percentage(current) {
  var invTimeLeft = MAX - current;
  var progress = (invTimeLeft * 100) / MAX;
  //document.getElementById("test2").innerHTML = progress;
  return progress;
}

function initTimer() {
  /*document.getElementById("test").innerHTML = "pausable: " + pausable + "<br>" +
    "paused: " + paused + "<br>" +
    "go: " + go + "<br>" +
    "globalTimeLeft: " + globalTimeLeft;*/

  //initial setup
  timerIsntChanged = true;
  var hrsTimer = document.getElementById("Hrs");
  var minTimer = document.getElementById("Mins");
  var secTimer = document.getElementById("Secs");
  if (!pausable) {
    if (looped) {
      if (isMainTimer) {
        var minutes = document.getElementById("main-min").innerHTML;
      } else {
        var minutes = document.getElementById("break-min").innerHTML;
      }
    } else {
      var minutes = parseInt(minTimer.innerHTML);
    }
    var hours = parseInt(hrsTimer.innerHTML);
    var seconds = parseInt(secTimer.innerHTML);
    if (!hrsTimer.value) {
      hours = 0;
    }
    if (!secTimer.value) {
      seconds = 0;
    }

    var totalTime = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
    MAX = totalTime;
    THEEND = totalTime + Date.parse(new Date());
    globalTimeLeft = totalTime;
  } else {
    if (!paused) {
      paused = true;
    } else {
      THEEND = globalTimeLeft + Date.parse(new Date());
      paused = false;
    }
  }
  //timing loop
  go = true;
  pausable = true;
  var timerInterval = setInterval(function() {
    if (!timerIsntChanged) {
      go = false;
      endlessTiming = false;
      clearInterval(timerInterval);
    }
    if (paused) {
      go = false;
      endlessTiming = false;
      clearInterval(timerInterval);
    }
    if (!go) return;

    var t = timeRemaining(THEEND);
    globalTimeLeft = t.total;
    var percentDone = percentage(t.total);
    document.getElementById("timer").style.backgroundSize = percentDone + "% 100%";
        //document.getElementById("timer-progress-bar").setAttribute("aria-valuenow", "percentage(t.total)");
    if (t.h > 0) {
      hrsTimer.innerHTML = t.h + ":";
    }
    minTimer.innerHTML = ("0" + t.m).slice(-2) + ":";
    secTimer.innerHTML = ("0" + t.s).slice(-2);

    if (t.total <= 0) { //end of timer
      pausable = false;
      var audio = new Audio('http://aintuanengineer.com/audio/notification.mp3');
      audio.play();
      $('#Hrs').empty();
      $('#Min').empty();
      $('#Sec').empty();

      //switch to other timer after timer is done
      if (isMainTimer == true) {
        minTimer.innerHTML = document.getElementById("break-min").innerHTML + ":";
        document.getElementById("timer-label").innerHTML = "Break";
        isMainTimer = false;
      } else {
        minTimer.innerHTML = document.getElementById("main-min").innerHTML + ":";
        document.getElementById("timer-label").innerHTML = "Main";
        isMainTimer = true;
      }
      looped = true;
      clearInterval(timerInterval);
      initTimer();
    }
  }, 1000);
}