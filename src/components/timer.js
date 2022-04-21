// Found information from: https://www.w3schools.com/jsref/met_win_setinterval.asp
var oneSecond = setInterval(countdownTimer, 1000);
var timeInSeconds = 0;

function countdownTimer() {
    // if (timeInSeconds === 0) {
    //     clearInterval(oneSecond);
    //     alert("Your time is up!");
    //     return;
    // }
    // TODO: Add a feature that stops timer when game is finished. 
    document.getElementById("timer").innerHTML = timeInSeconds;
    timeInSeconds += 1;
}
