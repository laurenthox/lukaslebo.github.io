function Brick(x,y) {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.brickW = 30;
    this.brickH = 15;
    this.posX = x;
    this.posY = y;
    this.isHit = false;
}

Brick.prototype.draw = function() {
    if (this.isHit) {
        return;
    }
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(this.posX,this.posY,this.brickW,this.brickH);
}

Brick.prototype.check = function(bX, bY, bR, velX, velY) {
    var x = this.posX;
    var y = this.posY;
    var w = this.brickW;
    var h = this.brickH;

    if (
        bX+bR > x && bX-bR < x+w &&
        bY+bR > y && bY-bR < y+h 
    ) {
        console.log('hit');
        this.isHit = true;
        arr = [true];
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