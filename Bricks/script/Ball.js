function Ball() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.ctx.canvas.clientWidth;
    this.height = this.ctx.canvas.clientHeight;
    this.ballR = 5;
    this.ballX = this.width/2;
    this.ballY = this.height-20;
    this.MaxVel = 5;
    this.velX = 0;
    this.velY = 0;
}

Ball.prototype.draw = function(n) {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'white';
    if (n>0) {
        this.ctx.fillStyle = 'red';
    }
    this.ctx.arc(this.ballX,this.ballY,this.ballR,0,Math.PI*2);
    this.ctx.fill();
}

Ball.prototype.reset = function() {
    this.ballX = this.width/2;
    this.ballY = this.height-20;
    this.velX = 0;
    this.velY = 0;
}

Ball.prototype.launch = function() {
    do {
        this.velX = Math.random()*2*this.MaxVel-this.MaxVel;
    } while (Math.abs(this.velX) > this.MaxVel*0.5) 
    this.velY = -Math.sqrt((this.MaxVel*this.MaxVel)-(this.velX*this.velX));
}

Ball.prototype.launchRNG = function() {
    this.velX = Math.random()*2*this.MaxVel-this.MaxVel;
    this.velY = Math.sqrt((this.MaxVel*this.MaxVel)-(this.velX*this.velX))*((Math.random()<0.5)? -1:1);
}

Ball.prototype.move = function() {
    this.ballX += this.velX;
    this.ballY += this.velY;
}

// Reflects Ball at Paddle. Takes paddleX and paddleWidth
Ball.prototype.paddleReflection = function(pX,pW) {
    var maxFrac = 0.9;
    var influence = 0.5; // between 0 and 1
    var frac = ((this.ballX-pX)/pW*2-1);
    this.velX += (frac*this.MaxVel*influence);
    if (this.velX < -this.MaxVel*maxFrac) {
        this.velX = -this.MaxVel*maxFrac;
    }
    else if (this.velX > this.MaxVel*maxFrac) {
        this.velX = this.MaxVel*maxFrac;
    }
    this.velY = -Math.sqrt((this.MaxVel*this.MaxVel)-(this.velX*this.velX));
}