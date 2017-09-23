function Brick(x,y,lifes) {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.brickW = 30;
    this.brickH = 15;
    this.posX = x;
    this.posY = y;
    this.isHit = false;
    this.color = ['#0004ff','#e500ff','#ff7b00'];
    this.lifes = (lifes>1 && lifes<=3 && typeof(lifes)=='number')? lifes:1;
}

Brick.prototype.draw = function() {
    if (this.isHit) {
        return;
    }
    this.ctx.fillStyle = this.color[this.lifes-1];
    this.ctx.fillRect(this.posX,this.posY,this.brickW,this.brickH);
}

Brick.prototype.check = function(bX, bY, bR, velX, velY,ballOnFire) {
    var x = this.posX;
    var y = this.posY;
    var w = this.brickW;
    var h = this.brickH;

    if (
        bX+bR > x && bX-bR < x+w &&
        bY+bR > y && bY-bR < y+h 
    ) {
        var arr = [true]; // arr: brick collision true
        this.lifes--;
        if (ballOnFire>0) {
            this.lifes = 0;
            this.isHit = true;
            arr.push(true); // brick killed true
            return arr;
        }
        if (this.lifes == 0) {
            this.isHit = true;
            arr.push(true); // brick killed true
        }
        else {
            arr.push(false); // brick killed false
        }
        var up = false, down = false, left = false, right = false;
        var dx = (velX>0)? x-(bX-bR):(bX+bR)-(x+w);
        var dy = (velY>0)? y-(bY-bR):(bY+bR)-(y+h);

        if (velY>0 && dy>dx) {up = true;}
        else if (velY<0 && dy>dx) {down = true;}
        else if (velX>0 && dx>dy) {left = true;}
        else if (velX<0 && dx>dy) {right = true;}
        else if (dx==dy) {down = true; left = true;}

        if (up) {arr.push('up');}
        if (down) {arr.push('down');}
        if (left) {arr.push('left');}
        if (right) {arr.push('right');}
        return arr; // where to reflect
    }
    return [false]; // no brick collision
}