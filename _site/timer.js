/**************************************************************
/
/           GOLBAL VARIABLES
/
/*************************************************************/
// var RESET_VALUE = 15;
var RESET_VALUE = 150;
var count=RESET_VALUE;
var isRunning = false;
var counter = null;

/**************************************************************
/
/           GET HTML ELEMENTS
/
/*************************************************************/
var display = document.getElementById("timer_display");
var playStartSound = document.getElementById("start_sound");
var play30SecsSound = document.getElementById("30_second_warning");
var playEndSound = document.getElementById("time_up_sound");
var optionsButton = document.getElementById("options_button");
var optionsPanel = document.getElementById("options_wrapper");
var startButtonText = document.getElementById("start_pause");

/**************************************************************
/
/           INITIALIZE SOME ELEMENTS
/
/*************************************************************/
//hide the options panel by default
optionsPanel.style.display = "none";
optionsButton.innerHTML = "Show Options"
//initialize the start button text
startButtonText.innerHTML = "Start";
//initialize the timer display
display.innerHTML = secsToClock(RESET_VALUE);


/**************************************************************
/
/           MAIN TIMER FUNCTION
/             Called once per second by setInterval() when
/             the timer is running.
/
/*************************************************************/
function timer(){
  count=count-1;
  if (count <= 0)
  {
    console.log("timer ended");
    pause();
     clearInterval(counter);
     //counter ended, do something here
     display.innerHTML = secsToClock(0);
     if(playEndSound.checked){
      f_playEndSound();
     }
     
     resetAfter5Seconds();
     return;
  }

  //update the time on the display
  var time = secsToClock(count);
  display.innerHTML = time;

  //play sound effect, if any
  if (count === 30 && play30SecsSound.checked){
    f_play30SecondWarning();
  }
};

/**************************************************************
/
/           START, PAUSE, RESET, TOGGLE
/            Control when to start, pause, and reset the 
/            timer.
/
/*************************************************************/
function start(){
  console.log("Starting timer");
  //play the "start" sound effect, if applicable
  if (count === RESET_VALUE && playStartSound.checked){
    f_playStartSound();
  }
  if (!isRunning){
    isRunning = true;
    counter = setInterval(timer, 1000);
    startButtonText.innerHTML = "Pause";
  }
}

function pause(){
  console.log("Pausing timer");
  clearInterval(counter);
  startButtonText.innerHTML = "Start";
  isRunning = false;
}

function reset(){
  // location.reload();
  pause();
  console.log("Resetting timer");
  count = RESET_VALUE;
  display.innerHTML = secsToClock(count);
}

function toggle(){
  if (isRunning){
    pause();
  }
  else{
    start();
  }
}

/**************************************************************
/
/           RESET AFTER 5 SECONDS
/             Called after the timer ends. Waits 5 seconds,
/             then calls reset().
/
/*************************************************************/
function resetAfter5Seconds(){
  var fiveCount = 5;
  function silentCountdown(){
    fiveCount=fiveCount-1;
    if (fiveCount <=0){
      clearInterval(silentCountdown);
      reset();
      return;
    }
  }
  setInterval(silentCountdown, 1000);
}

/**************************************************************
/
/           SECONDS TO CLOCK FUNCTION
/             Converts a number of seconds (e.g. 67) to a
/             clock display format (e.g. 1:07).
/
/*************************************************************/
function secsToClock(time){
  var secs = time % 60;
  if (secs < 10){//force 2-digit display of seconds
    secs = "0" + secs;
  }
  var mins = Math.floor(time / 60);
  return mins + ":" + secs;
}

/**************************************************************
/
/           SOUND-PLAYING FUNCTIONS
/             Play the currently-selected sound in each category.
/
/*************************************************************/
function f_playStartSound(){
  var chosenSound = document.getElementById("select_start_sound").value;
  if (chosenSound === "charge"){
    var startSound = new Audio("/sounds/charge.mp3");
  }
  else if (chosenSound === "mariokart"){
    var startSound = new Audio("/sounds/mario_kart.mp3");
  }
  startSound.play();
}

function f_play30SecondWarning(){
  var chosenSound = document.getElementById("select_30secs_sound").value;
  if (chosenSound === "laser"){
    var warningSound = new Audio("/sounds/laser.mp3");
  }
  else if (chosenSound === "church_bell"){
    var warningSound = new Audio("/sounds/church_bell.mp3");
  }
  warningSound.play();
}

function f_playEndSound(){
  var chosenSound = document.getElementById("select_end_sound").value;
  if (chosenSound === "buzzer"){
    var endSound = new Audio("/sounds/buzzer.mp3");
  }
  else if (chosenSound === "ding"){
      var endSound = new Audio("/sounds/four_ding.mp3");
  }
  endSound.play();
}

/**************************************************************
/
/           TOGGLE OPTIONS
/             Show or hide the options panel
/
/*************************************************************/
function toggleOptions(){
  if (optionsPanel.style.display === "none"){
    optionsPanel.style.display = "block";
    optionsButton.innerHTML = "Hide Options"
  }
  else{
    optionsPanel.style.display = "none";
    optionsButton.innerHTML = "Show Options"
  }
}

/**************************************************************
/
/           KEY LISTENER
/             Listens for keypresses and performs the
/             appropriate actions.
/
/*************************************************************/
document.addEventListener('keypress', function(event) {
    if(event.key == ' ' || event.key == "Spacebar") {
        //console.log(document.activeElement.className);
        if (document.activeElement.className != "timer_button"){
          toggle();
        }
    }
    else if (event.key == 'r'){
        if (document.activeElement.className != "timer_button"){
          reset();
        }
    }
});







