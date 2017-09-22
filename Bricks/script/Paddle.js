function Paddle() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.ctx.canvas.clientWidth;
    this.height = this.ctx.canvas.clientHeight;
    this.paddleWidth = 80;
    this.paddleThickness = 10;
    this.offset = 5;
    this.paddleX = this.width/2-this.paddleWidth/2;
    this.paddleY = this.height-this.offset-this.paddleThickness;
    this.paddleVel = 6;
    this.goLeft = false;
    this.goRight = false;
}

Paddle.prototype.draw = function() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(this.paddleX,this.paddleY,this.paddleWidth,this.paddleThickness);
}

Paddle.prototype.move = function() {
    if (this.goLeft && this.paddleX > 0) {
        this.paddleX -= this.paddleVel;
    }
    else if (this.goRight && this.paddleX+this.paddleWidth < this.width) {
        this.paddleX += this.paddleVel;
    }
}

Paddle.prototype.reset = function() {
    this.paddleX = this.width/2-this.paddleWidth/2;
}