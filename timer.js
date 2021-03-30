/**************************************************************
/
/           GOLBAL VARIABLES
/
/*************************************************************/
// var RESET_VALUE = 15;
var RESET_VALUE = 150;
var count = RESET_VALUE;
var isRunning = false;
var counter = null;
var brick_font = false;
var options_collapsed_width;

//only preload the digits we'll actually need
var brick_font_digits = [
	'0-left.png',
	'1-left.png',
	'2-left.png',
	'0-mid.png',
	'1-mid.png',
	'2-mid.png',
	'3-mid.png',
	'4-mid.png',
	'5-mid.png',
	'0-right.png',
	'1-right.png',
	'2-right.png',
	'3-right.png',
	'4-right.png',
	'5-right.png',
	'6-right.png',
	'7-right.png',
	'8-right.png',
	'9-right.png'
];

//Pre-load sounds
var charge_sound = new Audio('/sounds/charge.mp3');
var mk_sound = new Audio('/sounds/mario_kart.mp3');
var laser_sound = new Audio('/sounds/laser.mp3');
var church_bell_sound = new Audio('/sounds/church_bell.mp3');
var buzzer_sound = new Audio('/sounds/buzzer.mp3');
var ding_sound = new Audio('/sounds/four_ding.mp3');

/**************************************************************
/
/           GET HTML ELEMENTS
/
/*************************************************************/
var display = document.getElementById('timer_display');
var startButtonText = document.querySelector('#start_pause');

/**************************************************************
/
/           INITIALIZE SOME ELEMENTS
/
/*************************************************************/
//initialize the start button text
startButtonText.innerHTML = 'Start';
//initialize the timer display
setClockValue(RESET_VALUE);

function setStartTime(val) {
	RESET_VALUE = val;
	reset();
}

function textToImage(text) {
	if (text.charAt(1) != ':' || text.length != 4) {
		// if (text.length != 3){
		console.error('Format: x:yz');
	} else {
		let left = text.charAt(0);
		let mid = text.charAt(2);
		let right = text.charAt(3);

		return `<svg class="brick-font" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1600 1200">
      <image x="0px" y="0px" width="650px" height="1200px" href="/brick_digits/${left}-left.png"></image>
      <image x="649px" y="0px" width="470px" height="1200px" href="/brick_digits/${mid}-mid.png"></image>
      <image x="1118px" y="0px" width="480px" height="1200px" href="/brick_digits/${right}-right.png"></image>
</svg>`;
	}
}

function preloadImages() {
	brick_font_digits.forEach((digit) => {
		let img = new Image();
		img.src = `/brick_digits/${digit}`;
	});
}

//set the clock value (val in seconds)
function setClockValue(val) {
	let formatted = secsToClock(val);
	display.innerHTML = brick_font ? textToImage(formatted) : formatted;
}

/**************************************************************
/
/           MAIN TIMER FUNCTION
/             Called once per second by setInterval() when
/             the timer is running.
/
/*************************************************************/
function timer() {
	count = count - 1;
	if (count <= 0) {
		console.log('timer ended');
		pause();
		clearInterval(counter);
		setClockValue(0);
		playEndSound();
		//Wait 5 seconds, then reset
		setTimeout(reset, 5000);
		return;
	}

	//update the time on the display
	setClockValue(count);

	//play sound effect, if any
	if (count == 30) {
		play30SecondWarning();
	}
}

/**************************************************************
/
/           START, PAUSE, RESET, TOGGLE
/            Control when to start, pause, and reset the 
/            timer.
/
/*************************************************************/
function start() {
	console.log('Starting timer');
	//play the "start" sound effect, if applicable
	if (count === RESET_VALUE) {
		playStartSound();
	}
	if (!isRunning) {
		isRunning = true;
		counter = setInterval(timer, 1000);
		startButtonText.innerHTML = 'Pause';
	}
}

function pause() {
	console.log('Pausing timer');
	clearInterval(counter);
	startButtonText.innerHTML = 'Start';
	isRunning = false;
}

function reset() {
	// location.reload();
	pause();
	console.log('Resetting timer');
	count = RESET_VALUE;
	setClockValue(count);
}

function toggle() {
	if (isRunning) {
		pause();
	} else {
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
function secsToClock(time) {
	var secs = time % 60;
	if (secs < 10) {
		//force 2-digit display of seconds
		secs = '0' + secs;
	}
	var mins = Math.floor(time / 60);
	return mins + ':' + secs;
}

/**************************************************************
/
/           SOUND-PLAYING FUNCTIONS
/             Play the currently-selected sound in each category.
/
/*************************************************************/
function playStartSound() {
	if (document.querySelector('#start-charge').classList.contains('active')) {
		charge_sound.play();
	} else if (document.querySelector('#start-mario').classList.contains('active')) {
		mk_sound.play();
	}
}

function play30SecondWarning() {
	if (document.querySelector('#warning-laser').classList.contains('active')) {
		laser_sound.play();
	} else if (document.querySelector('#warning-bells').classList.contains('active')) {
		church_bell_sound.play();
	}
}

function playEndSound() {
	if (document.querySelector('#end-buzzer').classList.contains('active')) {
		buzzer_sound.play();
	} else if (document.querySelector('#end-ding').classList.contains('active')) {
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
	if (event.key == ' ' || event.key == 'Spacebar') {
		//console.log(document.activeElement.className);
		if (document.activeElement.className != 'timer_button') {
			toggle();
		}
	} else if (event.key == 'r') {
		reset();
	}
});

// do some initialization on page load
document.addEventListener('DOMContentLoaded', () => {
	setTimeout(() => {
		options_collapsed_width = $('#optionsCard').css('width');
	}, 1000);
	$('#optionsCard').animate({ right: '1em' }, 0);

	// read font choice from local storage (if any)
	document.querySelector('#font-default').checked = false;
	document.querySelector('#font-ubuntu').checked = false;
	document.querySelector('#font-7seg').checked = false;
	document.querySelector('#font-bricks').checked = false;
	switch (localStorage.getItem('font_choice')) {
		case 'ubuntu-mono-bold':
			document.querySelector('#font-ubuntu').checked = true;
			break;
		case 'digital-7-mono':
			document.querySelector('#font-7seg').checked = true;
			break;
		case 'bricks':
			document.querySelector('#font-bricks').checked = true;
			break;
		default:
			document.querySelector('#font-default').checked = true;
			localStorage.setItem('font_choice', 'default');
	}
	setFont();

	// read appearance choice from local storage (if any)
	document.querySelector('#appearance-light').checked = false;
	document.querySelector('#appearance-dark').checked = false;
	let appearance_pref = localStorage.getItem('appearance');
	if (appearance_pref == 'light') {
    document.querySelector('#appearance-light').checked = true;
  }
  else if (appearance_pref == 'dark') {
    document.querySelector('#appearance-dark').checked = true;
  }
  else {
    // if no choice in local storage, default to dark
	document.querySelector('#appearance-dark').checked = true;
	localStorage.setItem("appearance", "dark");
  }
  setAppearance();

	//set program to vex if specified
	let params = new URLSearchParams(window.location.search);
	if (params.get('program') == 'vex') {
		setStartTime(60);
		console.log('Loaded in VEX mode');
		setTimeout(() => {
			document.querySelector('#program-fll').classList.remove('active');
			document.querySelector('#program-vex').classList.add('active');
		}, 500);
	}
});

function setFont() {
	let font_choice = localStorage.getItem('font_choice');
	if (font_choice == 'default') {
		brick_font = false;
		document.querySelector('#timer_display').style.fontFamily = '';
	} else if (font_choice == 'bricks') {
		//preload images only when the brick font is selected
		preloadImages();
		brick_font = true;
	} else {
		brick_font = false;
		document.querySelector('#timer_display').style.fontFamily = font_choice;
	}
	setClockValue(count);
}

function changeFont(newFont) {
	localStorage.setItem('font_choice', newFont);
	setFont();
}

$('#options').on('show.bs.collapse', function() {
	$('#optionsCard').animate({ width: '35em', 'max-width': '90vw', right: '1em' });
	$('#options_button_symbol').removeClass('fa-cog');
	$('#options_button_symbol').addClass('fa-times');
});

$('#options').on('hide.bs.collapse', function() {
	$('#optionsCard').animate({ width: options_collapsed_width, right: '1em' });
	$('#options_button_symbol').removeClass('fa-times');
	$('#options_button_symbol').addClass('fa-cog');
});

function changeAppearance(newAppearance){
  localStorage.setItem('appearance', newAppearance);
  setAppearance();
}

function setAppearance() {
	// let darkMode = mode == 'dark';
  // let color = mode == 'dark' ? 'dark' : 'light';
  let darkMode = localStorage.getItem('appearance') == "dark";
	document.querySelector('body').classList.toggle('bg-dark', darkMode);
	document.querySelector('body').classList.toggle('text-light', darkMode);
	document.querySelectorAll('.card').forEach((card) => {
		card.classList.toggle('bg-dark', darkMode);
		card.classList.toggle('border-secondary', darkMode);
		// card.classList.toggle("text-light",)
	});
}
