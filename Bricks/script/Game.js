function Game() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.ctx.canvas.clientWidth;
    this.height = this.ctx.canvas.clientHeight;
    this.paddle = new Paddle();
    this.ball = [new Ball()];
    this.bricks = [];
    this.powerups = [];
    this.isInitialized = false;
    this.pause = false;
    this.lifes = 5;
    this.score = 0;
    this.dropChance = 0;
    this.win = -1;
    this.stickBall = true;
    this.printHint = true;
    this.stopAction = false;
    this.isGameOver = false;
    this.isWin = false;
    this.ballOnFire = 0;
    this.sound = new SoundEffects();
}

Game.prototype.drawBackground = function() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0,0,this.width,this.height);
}

Game.prototype.drawHint = function() {
    this.ctx.fillStyle = 'gray';
    this.ctx.font = '30px Impact';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("Hit Space to Launch Ball",this.width/2,this.height/2+50);
}

Game.prototype.drawGameover = function() {
    this.ctx.fillStyle = 'gray';
    this.ctx.font = '50px Impact';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("Gameover",this.width/2,this.height/2+50);
}

Game.prototype.drawWin = function() {
    this.ctx.fillStyle = 'gray';
    this.ctx.font = '50px Impact';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("You win!",this.width/2,this.height/2+50);
}

Game.prototype.paused = function() {
    this.ctx.fillStyle = 'gray';
    this.ctx.font = '50px Impact';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("Paused",this.width/2,this.height/2+50);
}

Game.prototype.drawLifes = function() {
    this.ctx.fillStyle = 'gray';
    this.ctx.font = '20px Impact';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(this.lifes,this.width-30,25);
    this.ctx.font = '25px Impact';
    this.ctx.fillText("♥",this.width-10,25);
}

Game.prototype.drawToScreen = function() {
    this.drawBackground();
    this.bricks.forEach(el => el.draw());
    if (!this.stopAction) {
        this.paddle.draw();
        this.ball.forEach(el => el.draw(this.ballOnFire));
        this.powerups.forEach(el => el.draw());
    }
    this.drawLifes();
    if (this.printHint) {
        this.drawHint();
    }
    if (this.pause && !this.isGameOver && !this.isWin) {
        this.paused();
    }
    if (this.isGameOver) {
        this.drawGameover();
    }
    if (this.isWin) {
        this.drawWin();
    }
}

Game.prototype.gameTasks = function() {
    if (!this.pause && !this.stopAction) {
        this.collisionCheck();
        this.paddle.move();
        if (this.stickBall) {this.ball[0].ballX = this.paddle.paddleX+this.paddle.paddleWidth/2;}
        this.ball.forEach(el => el.move());
        this.powerups.forEach(el => el.move());
    }
    this.drawToScreen();
}

Game.prototype.runGame = function() {
    if (!this.isInitialized) {
        this.setup();
        this.brickPatternSimple();
        this.isInitialized = true;
    }
    that = this;
    setInterval(function(){
        that.gameTasks();
    }, 17);
}

Game.prototype.resetSoft = function() {
    this.ball = [new Ball()];
    this.ball.forEach(el => el.reset());
    this.stickBall = true;
}

Game.prototype.resetHard = function() {
    this.resetSoft();
    this.stopAction = false;
    this.isGameOver = false;
    this.pause = false;
    this.printHint = true;
    this.isWin = false;
    this.lifes = 5;
    this.score = 0;
    this.ballOnFire = 0;
    this.bricks = [];
    this.powerups = [];
    this.paddle.reset();
    this.brickPatternSimple();
    if (this.sound.restart) {
        this.sound.playMusic();
        this.sound.restart = false;
    }
}

Game.prototype.collisionCheck = function() {
    var ballsToSplice = [];
    for (var i = 0; i < this.ball.length; i++) {
        // ball hits paddle
        if (
            this.ball[i].ballX > this.paddle.paddleX && 
            this.ball[i].ballX < this.paddle.paddleX+this.paddle.paddleWidth && 
            this.ball[i].ballY+this.ball[i].ballR > this.height-this.paddle.offset-this.paddle.paddleThickness
        ) {
            this.sound.wallhit();
            this.ball[i].paddleReflection(this.paddle.paddleX,this.paddle.paddleWidth);
        }
    
        // ball hits box boundary
        if (
            this.ball[i].ballX-this.ball[i].ballR < 0 || 
            this.ball[i].ballX+this.ball[i].ballR > this.width
        ) {
            this.sound.wallhit();
            this.ball[i].velX = -this.ball[i].velX;
            // fix issue when ball is stack in wall
            if (this.ball[i].ballX < this.width/2) {
                this.ball[i].ballX = this.ball[i].ballR;
            }
            else {
                this.ball[i].ballX = this.width-this.ball[i].ballR;
            }
        }
        if (this.ball[i].ballY-this.ball[i].ballR < 0) {
            this.sound.wallhit();
            this.ball[i].velY = -this.ball[i].velY;
            // fix when wall is stuck in wall
            this.ball[i].ballY = this.ball[i].ballR; 
        }
    
        // ball is lost at bottom (Player loses a life)
        if (this.ball[i].ballY+this.ball[i].ballR > this.height) {
            if (this.ball.length == 1) {
                this.lifes--;
                // also remove powerup
                this.ballOnFire = 0;
                if (this.lifes == 0) {
                    this.sound.stopMusic();
                    this.sound.gameover();
                    this.isGameOver = true;
                    this.stopAction = true;
                    return;
                }
                this.sound.lost();
                this.resetSoft();
            }
            else {
                ballsToSplice.push(i);
            }
        }
    
        // check for collision between bricks and ball
        for (var j = 0; j < this.bricks.length; j++) {
            if (this.bricks[j].isHit == false) {
                var check = this.bricks[j].check(this.ball[i].ballX, this.ball[i].ballY, this.ball[i].ballR, this.ball[i].velX, this.ball[i].velY, this.ballOnFire);
                if (check[0] == true) {
                    if (check[1]) {
                        this.score++;
                    }
                    if (this.score == this.win){
                        this.stopAction = true;
                        this.isWin = true;
                        this.sound.stopMusic();
                        this.sound.win();
                        return;
                    }
                    if (this.ballOnFire>0) {
                        this.sound.firehit();
                        return;
                    }
                    this.sound.hit();
                    if (check.length==4) {
                        this.ball[i].velY = -this.ball[i].velY;
                        this.ball[i].velX = -this.ball[i].velX;
                    }
                    else if (check[2]=='up' || check[2]=='down') {
                        this.ball[i].velY = -this.ball[i].velY;
                    }
                    else if (check[2]=='left' || check[2]=='right') {
                        this.ball[i].velX = -this.ball[i].velX;
                    }
                    if (Math.random()<this.dropChance && check[1]) {
                        this.dropChance = 0;
                        this.powerups.push(new PowerUp(this.bricks[j].posX+this.bricks[j].brickW,this.bricks[j].posY+this.bricks[j].brickH));
                    }
                    else {
                        this.dropChance += 0.02;
                    }
                }
            }
        }
    }
    // Delete any balls that have been missed
    for (var i = 0; i < ballsToSplice.length; i++) {
        this.ball.splice(ballsToSplice[i],1);
        ballsToSplice = ballsToSplice.map(el => --el);
    }

    // check if powerups are collected
    for (var i = 0; i < this.powerups.length; i++) {
        var check = this.powerups[i].check(this.paddle.paddleX, this.paddle.paddleY, this.paddle.paddleWidth, this.paddle.paddleThickness, this.paddle.offset);
        if (check == true) {
            this.sound.pickUp();
            if (this.powerups[i].type == 0) {
                this.ballOnFire = 20*60; // 20 seconds
            }
            else if (this.powerups[i].type == 1) {
                for (var j = 0; j < 5; j++) {
                    this.ball.push(new Ball());
                    var newBall = this.ball[this.ball.length-1];
                    var oldestBall = this.ball[0];
                    newBall.ballX = oldestBall.ballX;
                    newBall.ballY = oldestBall.ballY;
                    newBall.launchRNG();
                }
            }
        }
    }
    // wear out powerup
    if (this.ballOnFire>0) {
        --this.ballOnFire;
    }
}

Game.prototype.setup = function() {
    // set up event listeners (call this function only one time!)
    console.log('Setting up event listeners...');
    that = this;
    document.addEventListener('keypress',function(e) {
        if (e.keyCode == 32) {
            e.preventDefault();
            if (that.stickBall) {
                that.printHint = false;
                that.stickBall = false;
                that.ball[0].launch();
            }
            else {
                that.pause = !(that.pause);
            }
        }
        else if (e.keyCode == 82 || e.keyCode == 114) {
            that.resetHard();
        }
    });
    document.addEventListener('keydown',function(e){
        if(e.keyCode == 65 || e.keyCode == 37){
            that.paddle.goLeft = true; that.paddle.goRight = false;
        }
        else if (e.keyCode == 68 || e.keyCode == 39) {
            that.paddle.goRight = true; that.paddle.goLeft = false;
        }
    });
    document.addEventListener('keyup',function(e){
        if(e.keyCode == 65 || e.keyCode == 37){
            that.paddle.goLeft = false;
        }
        else if (e.keyCode == 68 || e.keyCode == 39) {
            that.paddle.goRight = false;
        }
    });
    // Start music
    this.sound.playMusic();
}

Game.prototype.brickPatternSimple = function() {
    // Start coordinates
    var x0 = 35;
    var y0 = 50;
    // Gap distance
    var d = 5;
    // brick dimensions
    var brickW = (new Brick(0,0)).brickW;
    var brickH = (new Brick(0,0)).brickH;
    // Simple Pattern
    for (var i = 0; i < 18; i++) {
        for (var j = 0; j < 10; j++) {
            var y = y0+j*(brickH+d);
            var x = x0+i*(brickW+d);
            var lifes = Math.floor(Math.random()*3)+1;
            this.bricks.push(new Brick(x,y,lifes));
        }
    }
    // brick count
    this.win = this.bricks.length;
    console.log('Bricks created in Simple Pattern (number of bricks is '+this.bricks.length+')');
}
