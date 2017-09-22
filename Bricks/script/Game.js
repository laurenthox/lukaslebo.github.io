function Game() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.ctx.canvas.clientWidth;
    this.height = this.ctx.canvas.clientHeight;
    this.paddle = new Paddle();
    this.ball = new Ball();
    this.bricks = [];
    this.isInitialized = false;
    this.pause = true;
    this.lifes = 5;
    this.score = 0;
    this.win = -1;
    this.isFlying = false;
}

Game.prototype.drawBackground = function() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0,0,this.width,this.height);
}

Game.prototype.drawToScreen = function() {
    this.drawBackground();
    this.bricks.forEach(el => el.draw());
    this.paddle.draw();
    this.ball.draw();
    this.drawLifes();
}

Game.prototype.gameTasks = function() {
    if (!this.pause) {
        this.collisionCheck();
        this.paddle.move();
        this.ball.move();
    }
    this.drawToScreen();
    if (this.pause) {
        this.paused();
    }
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

Game.prototype.runGame = function() {
    if (!this.isInitialized) {
        this.ball.reset();
        this.setup();
        this.brickPatternSimple();
        this.isInitialized = true;
    }

    setInterval(function(){
        game.gameTasks();
    }, 17)
}

Game.prototype.resetSoft = function() {
    this.ball.launch();
}

Game.prototype.resetHard = function() {
    this.lifes = 5;
    this.score = 0;
    this.bricks = [];
    this.paddle.reset();
    this.ball.reset();
    this.brickPatternSimple();
    this.pause = true;
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
        this.resetSoft();
    }

    for (var i = 0; i < this.bricks.length; i++) {
        if (this.bricks[i].isHit == false) {
            var check = this.bricks[i].check(this.ball.ballX, this.ball.ballY, this.ball.ballR, this.ball.velX, this.ball.velY);
            if (check[0] == true) {
                this.score++;
                if (check.length==2) {
                    this.ball.velY = -this.ball.velY;
                    this.ball.velX = -this.ball.velX;
                }
                else if (check[1]=='up' || check[1]=='down') {
                    this.ball.velY = -this.ball.velY;
                }
                else if (check[1]=='left' || check[1]=='right') {
                    this.ball.velX = -this.ball.velX;
                }
                if (this.score == this.win){
                    // call win
                }
            }
        }
    }

}

Game.prototype.setup = function() {
    // set up event listeners only once
    console.log('Setting up event listeners...');
    that = this;
    document.addEventListener('keypress',function(e) {
        if (e.keyCode == 32) {
            that.pause = !(that.pause);
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
    document.addEventListener('keypress',function(e){
        if (e.keyCode == 82) {
            that.resetHard();
        }
    });
}

Game.prototype.brickPatternSimple = function() {
    // Start coordinates
    var x0 = 35;
    var y0 = 50;
    var d = 5;
    var brickW = (new Brick(0,0)).brickW;
    var brickH = (new Brick(0,0)).brickH;
    for (var i = 0; i < 18; i++) {
        for (var j = 0; j < 10; j++) {
            var y = y0+j*(brickH+d);
            var x = x0+i*(brickW+d);
            this.bricks.push(new Brick(x,y));
        }
    }
    this.win = this.bricks.length;
    console.log('Bricks created in Simple Pattern (number of bricks is '+this.bricks.length+')');
}
