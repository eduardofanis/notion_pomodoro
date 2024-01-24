let timerInterval;
let isRunning = false;
let isBreakMode = false;
let seconds = 60;

let minutes = isBreakMode ? 10 : 50;

let theme = window.localStorage.getItem("theme") == "light" ? "light" : "dark";
let isSoundOn = window.localStorage.getItem("ring") == "false" ? false : true;

const ringSound = new Audio("ring.mp3");

function startPauseTimer() {
  if (isRunning == false) {
    startTimer();
  } else {
    pauseTimer();
  }
}

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
  isRunning = true;
  document.querySelector(".start-icon").classList.add("fa-pause");
  document.querySelector(".start-icon").classList.remove("fa-play");

  if (
    (minutes == 50 &&
      window.localStorage.getItem("focus-duration") !== "focus-25") ||
    (minutes == 25 &&
      window.localStorage.getItem("focus-duration") == "focus-25")
  )
    minutes--;

  if (
    (isBreakMode &&
      minutes == 10 &&
      window.localStorage.getItem("break-duration") !== "break-5") ||
    (isBreakMode &&
      minutes == 5 &&
      window.localStorage.getItem("break-duration") == "break-5")
  )
    minutes--;
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  document.querySelector(".start-icon").classList.add("fa-play");
  document.querySelector(".start-icon").classList.remove("fa-pause");
}

function restartTimer() {
  clearInterval(timerInterval);

  let focusMinutes =
    window.localStorage.getItem("focus-duration") == "focus-25" ? 25 : 50;

  let breakMinutes =
    window.localStorage.getItem("break-duration") == "break-5" ? 5 : 10;

  isRunning = false;
  seconds = 60;
  minutes = isBreakMode ? breakMinutes : focusMinutes;

  document.querySelector(".start-icon").classList.add("fa-play");
  document.querySelector(".start-icon").classList.remove("fa-pause");

  updateTimerDisplay();
}

function skipTimer() {
  if (isBreakMode == false) {
    setBreakMode();
  } else {
    setFocusMode();
  }
}

function setFocusMode() {
  isBreakMode = false;

  restartTimer();
}

function setBreakMode() {
  isBreakMode = true;

  restartTimer();
}

function updateTimer() {
  seconds--;
  if (seconds == 0) {
    seconds = 59;
    minutes--;
    if (minutes == 0) {
      skipTimer();

      if (isSoundOn == true) ringSound.play();
    }
  }

  updateTimerDisplay();
}

function updateTimerDisplay() {
  let formattedTime = `${formatTime(minutes)}:${
    formatTime(seconds) == 60 ? "00" : formatTime(seconds)
  }`;
  document.querySelector(".timer").innerHTML = formattedTime;
}

function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

function toggleSettings() {
  document.querySelector(".settings").classList.toggle("settings-display");
  document.querySelector(".container").classList.toggle("container-blur");
}

function toggleTheme() {
  let themeSwitch = document.querySelector(".theme-switch");

  if (themeSwitch.checked == true) {
    window.localStorage.setItem("theme", "light");
    setTheme();
  } else {
    window.localStorage.setItem("theme", "dark");
    setTheme();
  }
}

function toggleSound() {
  if (isSoundOn == true) {
    isSoundOn = false;
    window.localStorage.setItem("ring", false);
    setSoundIcon();
  } else {
    isSoundOn = true;
    window.localStorage.setItem("ring", true);
    setSoundIcon();
  }
}

function setSoundIcon() {
  if (window.localStorage.getItem("ring") == "true" || isSoundOn == true) {
    document.querySelector(".volume-button").classList.remove("fa-volume-off");
    document.querySelector(".volume-button").classList.add("fa-volume-up");
  } else {
    document.querySelector(".volume-button").classList.remove("fa-volume-up");
    document.querySelector(".volume-button").classList.add("fa-volume-off");
  }
}
setSoundIcon();

function setTheme() {
  let theme = window.localStorage.getItem("theme");
  let themeSwitch = document.querySelector(".theme-switch");
  let body = document.body.style;

  if (theme && theme == "light") {
    themeSwitch.checked = true;
    body.backgroundColor = "white";
    body.color = "#37352f";
    document
      .querySelectorAll(".fa")
      .forEach((element) => (element.style.color = "#37352f"));
  } else {
    themeSwitch.checked = false;
    body.backgroundColor = "#191919";
    body.color = "#d6d6d6";
    document
      .querySelectorAll(".fa")
      .forEach((element) => (element.style.color = "#d6d6d6"));
  }
}
setTheme();

function handleFocusChange(val) {
  window.localStorage.setItem("focus-duration", val);
  restartTimer();
}

function handleBreakChange(val) {
  window.localStorage.setItem("break-duration", val);
  restartTimer();
}

function loadSettings() {
  if (window.localStorage.getItem("focus-duration") == "focus-25") {
    document.querySelector("#focus").value = "focus-25";
  } else {
    document.querySelector("#focus").value = "focus-50";
  }

  if (window.localStorage.getItem("break-duration") == "break-5") {
    document.querySelector("#breaks").value = "break-5";
  } else {
    document.querySelector("#breaks").value = "break-10";
  }
  restartTimer();
}
loadSettings();
