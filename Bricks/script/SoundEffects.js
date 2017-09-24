function SoundEffects() {
    this.music = new Audio('music/Dubmood - Chiptune.mp3');
    this.hitSound = new Audio('music/hit.wav');
    this.lostSound = new Audio('music/lost.mp3');
    this.powerUp = new Audio('music/powerUpCollected.wav');
    this.hitSound2 = new Audio('music/firehit.wav');
    this.hitSound3 = new Audio('music/hitWall.mp3');
    this.success = new Audio('music/success.mp3');
    this.gameoverTheme = new Audio('music/gameover.mp3');
    this.effectVolume = 0.2;
    this.musicVolume = 1;
    this.isMuted = false;
    this.restart = false;
    this.setup();
}

SoundEffects.prototype.win = function() {
    if (this.isMuted) {return;}
    this.success.volume = this.musicVolume;
    this.success.currentTime = 0;
    this.success.play();
}

SoundEffects.prototype.hit = function() {
    if (this.isMuted) {return;}
    this.hitSound.volume = this.effectVolume;
    this.hitSound.currentTime = 0;
    this.hitSound.play();
}

SoundEffects.prototype.lost = function() {
    if (this.isMuted) {return;}
    this.lostSound.volume = this.effectVolume;
    this.lostSound.currentTime = 0;
    this.lostSound.play();
}

SoundEffects.prototype.pickUp = function() {
    if (this.isMuted) {return;}
    this.powerUp.volume = this.effectVolume;
    this.powerUp.currentTime = 0;
    this.powerUp.play();
}

SoundEffects.prototype.firehit = function() {
    if (this.isMuted) {return;}
    this.hitSound2.volume = this.effectVolume;
    this.hitSound2.currentTime = 0;
    this.hitSound2.play();
}

SoundEffects.prototype.wallhit = function() {
    if (this.isMuted) {return;}
    this.hitSound3.volume = this.effectVolume;
    this.hitSound3.currentTime = 0;
    this.hitSound3.play();
}

SoundEffects.prototype.gameover = function() {
    if (this.isMuted) {return;}
    this.gameoverTheme.volume = this.musicVolume;
    this.gameoverTheme.currentTime = 0;
    this.gameoverTheme.play();
}

SoundEffects.prototype.playMusic = function() {
    if (this.isMuted) {return;}
    this.gameoverTheme.pause();
    this.gameoverTheme.currentTime = 0;
    this.music.play();
    this.music.volume = this.musicVolume;
}

SoundEffects.prototype.stopMusic = function() {
    this.music.pause();
    this.music.currentTime = 0;
    this.restart = true;
}

SoundEffects.prototype.setup = function() {
    var myMusic = this;
    // loop music
    this.music.addEventListener('ended', function() {
        myMusic.currentTime = 0;
        myMusic.music.play();
    }, false);
    // pause / mute music with 'm'
    document.addEventListener('keypress', function(e) {
        if(e.keyCode == 109 || e.keyCode == 77) {
            if (!myMusic.isMuted) {
                myMusic.music.pause();
                myMusic.isMuted = !myMusic.isMuted;
            }
            else if (myMusic.isMuted) {
                myMusic.music.play();
                myMusic.isMuted = !myMusic.isMuted;
            }
        }
    });
}