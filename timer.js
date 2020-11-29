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
var startButtonText = document.querySelector("#start_pause");

/**************************************************************
/
/           INITIALIZE SOME ELEMENTS
/
/*************************************************************/
//initialize the start button text
startButtonText.innerHTML = "Start";
//initialize the timer display
display.innerHTML = secsToClock(RESET_VALUE);


function setStartTime(val){
  RESET_VALUE = val;
  reset();
}

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
    display.innerHTML = secsToClock(0);
    playEndSound();
    //Wait 5 seconds, then reset
    setTimeout(reset, 5000);
    return;
  }

  //update the time on the display
  var time = secsToClock(count);
  display.innerHTML = time;

  //play sound effect, if any
  if (count == 30){
    play30SecondWarning();
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
  if (count === RESET_VALUE){
    playStartSound();
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
function playStartSound(){
  if (document.querySelector("#start-charge").classList.contains("active")){
    charge_sound.play();
  }
  else if (document.querySelector("#start-mario").classList.contains("active")){
    mk_sound.play();
  }
}

function play30SecondWarning(){
  if (document.querySelector("#warning-laser").classList.contains("active")){
    laser_sound.play();
  }
  else if (document.querySelector("#warning-bells").classList.contains("active")){
    church_bell_sound.play();
  }
}

function playEndSound(){
  if (document.querySelector("#end-buzzer").classList.contains("active")){
    buzzer_sound.play();
  }
  else if (document.querySelector("#end-ding").classList.contains("active")){
    ding_sound.play();
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

var w;
// do some initialization on page load
document.addEventListener('DOMContentLoaded', () => {
  w = $('#optionsCard').css('width');
  $('#optionsCard').animate({'right':'1em'}, 0);

  // read font choice from local storage (if any)
  document.querySelector("#font-default").checked = false;
  document.querySelector("#font-ubuntu").checked = false;
  document.querySelector("#font-7seg").checked = false;
  switch (localStorage.getItem("font_choice")){
    case "ubuntu-mono-bold":
      document.querySelector("#font-ubuntu").checked = true;
    break;
    case "digital-7-mono":
      document.querySelector("#font-7seg").checked = true;
    break;
    default:
      document.querySelector("#font-default").checked = true;
      localStorage.setItem("font_choice", "default");
  }
  setFont();

  //set program to vex if specified
  let params = new URLSearchParams(window.location.search);
  if (params.get("program") == "vex"){
    setStartTime(60);
    document.querySelector("#program-fll").classList.remove("active");
    document.querySelector("#program-vex").classList.add("active");
  }
});

function setFont(){
  let font_choice = localStorage.getItem("font_choice")
  if (font_choice == "default"){
    document.querySelector("#timer_display").style.fontFamily = "";
  }
  else{
    document.querySelector("#timer_display").style.fontFamily = font_choice;
  }
}

function changeFont(newFont){
  localStorage.setItem("font_choice", newFont);
  setFont();
}

$('#options').on('show.bs.collapse', function () {
  $('#optionsCard').animate({'width': '35em', 'max-width':'90vw', 'right':'1em'});
});

$('#options').on('hide.bs.collapse', function () {
  $('#optionsCard').animate({'width': w, 'right':'1em'});
});