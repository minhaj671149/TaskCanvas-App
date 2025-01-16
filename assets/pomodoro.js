// Pomodoro Timer Logic
let timer;
let isRunning = false;
let isFocusTime = true; // Start with focus time
let defaultFocusTime = 25 * 60; // Default 25 minutes in seconds
let defaultBreakTime = 5 * 60; // Default 5 minutes in seconds
let remainingTime = defaultFocusTime;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const focusInput = document.getElementById('focusTime');
const breakInput = document.getElementById('breakTime');
const alarmSound = document.getElementById('alarmSound'); // Get the alarm sound

// Start the timer
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(countdown, 1000);
    }
});

// Pause the timer
pauseBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
});

// Reset the timer
resetBtn.addEventListener('click', resetTimer);

// Countdown function
function countdown() {
    if (remainingTime > 0) {
        remainingTime--;
        updateDisplay();
    } else {
        switchTimers(); // Switch between focus and break time when countdown is over
        playAlarm(); // Play the alarm sound when the timer hits zero
    }
}

// Switch between focus and break time
function switchTimers() {
    if (isFocusTime) {
        remainingTime = getBreakTime();
        isFocusTime = false;
    } else {
        remainingTime = getFocusTime();
        isFocusTime = true;
    }
    updateDisplay();
}

// Reset the timer to default focus time
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    remainingTime = getFocusTime();
    isFocusTime = true;
    updateDisplay();
}

// Update the display with minutes and seconds
function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    minutesDisplay.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
}

// Get custom focus time from input
function getFocusTime() {
    const focusMinutes = parseInt(focusInput.value) || 25;
    return focusMinutes * 60;
}

// Get custom break time from input
function getBreakTime() {
    const breakMinutes = parseInt(breakInput.value) || 5;
    return breakMinutes * 60;
}

// Play the alarm sound
function playAlarm() {
    alarmSound.play(); // Play the alarm when the timer hits zero
}

// Initialize the display with default time
updateDisplay();

document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.transition-content');
    const links = document.querySelectorAll('.transition-link');

    setTimeout(() => {
        content.classList.add('visible');
        links.forEach(link => link.classList.add('visible'));
    }, 100);

    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.href;

            content.classList.remove('visible');
            links.forEach(link => link.classList.remove('visible'));

            setTimeout(() => {
                window.location.href = target;
            }, 300);
        });
    });
});


function playAlarm() {
    alarmSound.currentTime = 0;
    alarmSound.play().catch(error => {
        console.error('Audio playback failed:', error);
    });

    // If running in an Android WebView, trigger notification
    if (window.AndroidNotification) {
        window.AndroidNotification.sendNotification("Time is up!");
    }
}