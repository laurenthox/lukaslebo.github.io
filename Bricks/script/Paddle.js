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
    that = this;
    document.addEventListener('keydown',function(e){
        if(e.keyCode == 65 || e.keyCode == 37){
            that.goLeft = true;
        }
        else if (e.keyCode == 68 || e.keyCode == 39) {
            that.goRight = true;
        }
    });
    document.addEventListener('keyup',function(e){
        if(e.keyCode == 65 || e.keyCode == 37){
            that.goLeft = false;
        }
        else if (e.keyCode == 68 || e.keyCode == 39) {
            that.goRight = false;
        }
    });
    if (this.goLeft && this.paddleX > 0) {
        this.paddleX -= this.paddleVel;
    }
    else if (this.goRight && this.paddleX+this.paddleWidth < this.width) {
        this.paddleX += this.paddleVel;
    }
}