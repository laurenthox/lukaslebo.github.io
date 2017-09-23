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
        arr = [true];
        this.lifes--;
        if (ballOnFire>0) {
            this.lifes = 0;
        }
        if (this.lifes == 0) {
            this.isHit = true;
            arr.push(true);
        }
        else {
            arr.push(false);
        }
        var up = false, down = false, left = false, right = false;
        if (bY+bR>y && bY+bR<y+h && velY>0) {up = true;}
        if (bY-bR<y+h && bY-bR>y && velY<0) {down = true;}
        if (bX+bR>x && bX+bR<x+w && velX>0) {left = true;}
        if (bX-bR<x+w && bX-bR>x && velX<0) {right = true;}
        if (up) {arr.push('up');}
        if (down) {arr.push('down');}
        if (left) {arr.push('left');}
        if (right) {arr.push('right');}
        return arr;
    }
    return [false];
}