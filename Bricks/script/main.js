
function closure() {
    let game = new Game();
    game.runGame();
}

var myClosure = new closure();
var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
if (is_safari && !is_chrome) {alert("Sounds may not play correctly in Safari. Please try using Chrome.");}