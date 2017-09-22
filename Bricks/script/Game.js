function Game() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.ctx.canvas.clientWidth;
    this.height = this.ctx.canvas.clientHeight;
    this.paddle = new Paddle();
    this.ball = new Ball();
    this.isInitialized = false;
}

Game.prototype.drawBackground = function() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0,0,this.width,this.height);
}

Game.prototype.drawToScreen = function() {
    this.drawBackground();
    this.paddle.draw();
    this.ball.draw();
}

Game.prototype.gameTasks = function() {
    this.collisionCheck();
    this.paddle.move();
    this.ball.move();
    this.drawToScreen();
}

Game.prototype.runGame = function() {
    if (!this.isInitialized) {
        this.ball.reset();
    }
    setInterval(function(){
        game.gameTasks();
    },17)
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
        this.ball.velY = -this.ball.velY;
    }
}

