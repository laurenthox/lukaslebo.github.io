function PowerUp(x,y) {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.ctx.canvas.clientWidth;
    this.height = this.ctx.canvas.clientHeight;
    this.x = x;
    this.y = y;
    this.R = 5;
    this.fallVel = 1;
    this.isCollected = false;
    this.failed = false;

}

PowerUp.prototype.draw = function() {
    if (this.isCollected || this.failed) {
        return;
    }
    this.ctx.beginPath();
    this.ctx.fillStyle = 'red';
    this.ctx.arc(this.x,this.y,this.R,0,Math.PI*2);
    this.ctx.fill();
}

PowerUp.prototype.move = function() {
    this.y += this.fallVel;
}

PowerUp.prototype.check = function(pX,pY,pW,pH,pOff) {
    if (this.failed) {
        return false;
    }
    if (
        this.x > pX && 
        this.x < pX+pW && 
        this.y+this.R > this.height-pOff-pH
    ) {
        this.isCollected = true;
        return true;
    }
    else if (this.y+this.R>this.height) {
        this.failed = true; 
    }
    return false;
}