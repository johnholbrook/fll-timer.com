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

//Pre-load sounds
var charge_sound = new Audio("/sounds/charge.mp3");
var mk_sound = new Audio("/sounds/mario_kart.mp3");
var laser_sound = new Audio("/sounds/laser.mp3");
var church_bell_sound = new Audio("/sounds/church_bell.mp3");
var buzzer_sound = new Audio("/sounds/buzzer.mp3");
var ding_sound = new Audio("/sounds/four_ding.mp3");

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
  if (count <= 0){
    console.log("timer ended");
    pause();
    clearInterval(counter);
    //counter ended, do something here
    display.innerHTML = secsToClock(0);
    if(playEndSound.checked){
     f_playEndSound();
    }
    //Wait 5 seconds, then reset
    setTimeout(reset, 5000);
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
    var startSound = charge_sound;
  }
  else if (chosenSound === "mariokart"){
    var startSound = mk_sound;
  }
  startSound.play();
}

function f_play30SecondWarning(){
  var chosenSound = document.getElementById("select_30secs_sound").value;
  if (chosenSound === "laser"){
    var warningSound = laser_sound;
  }
  else if (chosenSound === "church_bell"){
    var warningSound = church_bell_sound;
  }
  warningSound.play();
}

function f_playEndSound(){
  var chosenSound = document.getElementById("select_end_sound").value;
  if (chosenSound === "buzzer"){
    var endSound = buzzer_sound;
  }
  else if (chosenSound === "ding"){
      var endSound = ding_sound;
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
      reset();
    }
});


Set font when needed
document.querySelector("#select_font").onclick = function(){
  let font_choice = document.querySelector("#select_font").value;
  if (font_choice == "ubuntu-mono-bold"){
    document.querySelector("#timer_display").style.fontFamily = "Ubuntu";
  }
  else{
    document.querySelector("#timer_display").style.fontFamily = "";
  }
}





