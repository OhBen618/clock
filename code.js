// initialization
function initializePage() {
  // Hide the timeUpModal by default
  document.getElementById("timeUpModal").style.display = "none";
  
  // Set the initial states
  isTimeUp = false;
  isModalActive = false;
  
  // Initialize the progress bar and clock
  updateProgressBar();
  updateClock();
}

window.addEventListener("DOMContentLoaded", function() {
   // Hide the timeUpModal by default
   document.getElementById("timeUpModal").style.display = "none";
  
   // Set the initial states
   isTimeUp = false;
   isModalActive = false;

  this.document.getElementById("")
  setInterval(updateClock, 1000); // update every 1 second
  setInterval(updateProgressBar, 1000); // update every 1 second
  showModal(); // initial modal display
  updateTargetTimeIndicator(); // initial call
     
   // Initialize the progress bar and clock
   updateProgressBar();
   updateClock();
});
let isTimeUpModalShown = false; 
let timerStopped = false;

function showModal() {
  const modal = document.getElementById("timeModal");
  modal.style.display = "block";
}

function showTimerUpModal() {
  document.getElementById("timeUpModal").style.display = "block";
}

function closeTimeUpModal() {
  document.getElementById("timeUpModal").style.display = "none";
}

function setTargetTime() {
  const modal = document.getElementById("timeModal");
  const daysToAdd = parseInt(document.getElementById("daysToAdd").value) || 0;
  const targetHour = parseInt(document.getElementById("targetHour").value) || 0;
  const targetMinute = parseInt(document.getElementById("targetMinute").value) || 0;
  const targetSecond = parseInt(document.getElementById("targetSecond").value) || 0;

  const addDays = parseInt(document.getElementById("addDays").value) || 0;
  const addHours = parseInt(document.getElementById("addHours").value) || 0;
  const addMinutes = parseInt(document.getElementById("addMinutes").value) || 0;
  const addSeconds = parseInt(document.getElementById("addSeconds").value) || 0;

  const now = new Date();
  const targetDate = new Date(now);

  if (addDays || addHours || addMinutes || addSeconds) {
    targetDate.setDate(targetDate.getDate() + addDays);
    targetDate.setHours(targetDate.getHours() + addHours);
    targetDate.setMinutes(targetDate.getMinutes() + addMinutes);
    targetDate.setSeconds(targetDate.getSeconds() + addSeconds);
  } else {
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    targetDate.setHours(targetHour, targetMinute, targetSecond);
  }

  if (targetDate <= now) {
    alert("please enter a time in the future.");
    return;
  }

  localStorage.setItem("targetDate", targetDate.getTime());
  modal.style.display = "none";
  updateProgressBar(); 
  updateTargetTimeIndicator(); 
}



function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  const time12 = `${hours % 12 || 12}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${hours >= 12 ? 'pm' : 'am'}`;
  const time24 = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  document.getElementById("clock").innerText = time12;
  document.getElementById("clock24").innerText = time24;
  document.getElementById("date").innerText = now.toDateString();
}


let isTimeUp = false;
let isModalActive = false;

function updateProgressBar() {
  console.log("update progress bar has been triggered");
  console.log("isTimeUp at start:", isTimeUp)
  console.log("targetDate at start:", localStorage.getItem("targetDate"))
  if (isTimeUp) return
  console.log('updateProgressBar called', 'isTimeUp:', isTimeUp, 'isModalActive:', isModalActive);
  const now = new Date();
  const targetMillis = parseInt(localStorage.getItem("targetDate")) || 0;
  const targetDate = new Date(targetMillis);
  const totalMillis = targetDate - now;

  const days = Math.floor(totalMillis / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((totalMillis % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMillis % (1000 * 60)) / 1000);

  let timeLeft = days * 86400 + hours * 3600 + minutes * 60 + seconds;
  let timeLeftText = '';
  let components = [];

  if (targetMillis === 0) {
    document.getElementById("time-left").innerText = "time not set";
    isTimeUp = false;
    isModalActive = false;
    return;
  }

  if (timeLeft >= 0) {
    isTimeUp = false;
    isModalActive = false;
    if (days > 0) components.push(`${days} days`);
    if (hours > 0) components.push(`${hours} hrs`);
    if (minutes > 0) components.push(`${minutes} mins`);
    if (seconds >= 0) components.push(`${seconds} secs`);
    timeLeftText = `time left: ${components.join(", ")}`;
  } else if (!isTimeUp) {
    timeLeftText = "time's up!";
    if (!isModalActive) {
      document.getElementById("timeUpModal").style.display = "block";
      
      // Auto-dismiss the modal after 15 seconds
      setTimeout(function() {
        closeTimeUpModal();
      }, 15000);

      isModalActive = true;
    }

    isTimeUp = true;
  }

  document.getElementById("time-left").innerText = timeLeftText;

  if (totalMillis <= 0) {
    document.getElementById("progress-bar").style.width = "100%";
    document.getElementById("progress-bar").innerText = "100%";
    return;
  }
  
  const startTime = new Date(now);
  startTime.setHours(0,0,0,0);
  const totalTime = targetDate - startTime;
  
  const progress = ((totalTime - totalMillis) / totalTime) * 100;
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = progress + "%";
  progressBar.innerText = progress.toFixed(2) + "%";
}







function checkTimer(timeLeft) {
  if (timeLeft <= 0 && !timerStopped) {
    timerStopped = true;
    showTimerUpModal();
  }
}

function updateTargetTimeIndicator() {
  const targetMillis = parseInt(localStorage.getItem("targetDate")) || 0;
  const targetDate = new Date(targetMillis);
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const timeString = `time set: ${days[targetDate.getDay()]}, ${months[targetDate.getMonth()]} ${targetDate.getDate()} at ${targetDate.getHours() % 12 || 12}:${String(targetDate.getMinutes()).padStart(2, '0')} ${targetDate.getHours() >= 12 ? 'pm' : 'am'}`;
  document.getElementById("targetTimeIndicator").innerText = timeString;
}
