function Game() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.ctx.canvas.clientWidth;
    this.height = this.ctx.canvas.clientHeight;
    this.paddle = new Paddle();
    this.ball = new Ball();
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
        this.ball.draw(this.ballOnFire);
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
        if (this.stickBall) {this.ball.ballX = this.paddle.paddleX+this.paddle.paddleWidth/2;}
        this.ball.move();
        this.powerups.forEach(el => el.move());
    }
    this.drawToScreen();
}

Game.prototype.runGame = function() {
    if (!this.isInitialized) {
        this.setup();
        // this.brickPatternEasy();
        this.brickPatternSimple();
        this.isInitialized = true;
    }

    setInterval(function(){
        game.gameTasks();
    }, 17)
}

Game.prototype.resetSoft = function() {
    this.ball.reset();
    this.stickBall = true;
}

Game.prototype.resetHard = function() {
    this.stopAction = false;
    this.isGameOver = false;
    this.pause = false;
    this.stickBall = true;
    this.printHint = true;
    this.isWin = false;
    this.lifes = 5;
    this.score = 0;
    this.ballOnFire = 0;
    this.bricks = [];
    this.powerups = [];
    this.paddle.reset();
    this.ball.reset();
    this.brickPatternSimple();
}

Game.prototype.collisionCheck = function() {
    // ball hits paddle
    if (
        this.ball.ballX > this.paddle.paddleX && 
        this.ball.ballX < this.paddle.paddleX+this.paddle.paddleWidth && 
        this.ball.ballY+this.ball.ballR > this.height-this.paddle.offset-this.paddle.paddleThickness
    ) {
        this.ball.paddleReflection(this.paddle.paddleX,this.paddle.paddleWidth);
    }

    // ball hits box boundary
    if (this.ball.ballX-this.ball.ballR < 0 || this.ball.ballX+this.ball.ballR > this.width) {
        this.ball.velX = -this.ball.velX;
    }
    if (this.ball.ballY-this.ball.ballR < 0) {
        this.ball.velY = -this.ball.velY;
    }

    // ball is lost at bottom (Player loses a life)
    if (this.ball.ballY+this.ball.ballR > this.height) {
        this.lifes--;
        // also remove powerup
        this.ballOnFire = 0;
        if (this.lifes == 0) {
            this.isGameOver = true;
            this.stopAction = true;
            return;
        }
        this.resetSoft();
    }

    // check if powerups are collected
    for (var i = 0; i < this.powerups.length; i++) {
        var check = this.powerups[i].check(this.paddle.paddleX, this.paddle.paddleY, this.paddle.paddleWidth, this.paddle.paddleThickness, this.paddle.offset);
        if (check == true) {
            this.ballOnFire = 20*60; // 20 seconds
        }
    }
    // wear out powerup
    if (this.ballOnFire>0) {
        --this.ballOnFire;
    }

    // check for collision between bricks and ball
    for (var i = 0; i < this.bricks.length; i++) {
        if (this.bricks[i].isHit == false) {
            var check = this.bricks[i].check(this.ball.ballX, this.ball.ballY, this.ball.ballR, this.ball.velX, this.ball.velY, this.ballOnFire);
            if (check[0] == true) {
                if (check[1]) {
                    this.score++;
                }
                if (this.ballOnFire>0) {
                    return;
                } 
                if (check.length==4) {
                    console.log('corner hit');
                    this.ball.velY = -this.ball.velY;
                    this.ball.velX = -this.ball.velX;
                }
                else if (check[2]=='up' || check[2]=='down') {
                    this.ball.velY = -this.ball.velY;
                    console.log('up/down');
                }
                else if (check[2]=='left' || check[2]=='right') {
                    this.ball.velX = -this.ball.velX;
                    console.log('right/left');
                }
                if (this.score == this.win){
                    this.stopAction = true;
                    this.isWin = true;
                }
                if (Math.random()<this.dropChance) {
                    this.dropChance = 0;
                    this.powerups.push(new PowerUp(this.bricks[i].posX+this.bricks[i].brickW,this.bricks[i].posY+this.bricks[i].brickH));
                }
                else {
                    this.dropChance += 0.02;
                }
            }
        }
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
                that.ball.launch();
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
            that.paddle.goLeft = true;
        }
        else if (e.keyCode == 68 || e.keyCode == 39) {
            that.paddle.goRight = true;
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
