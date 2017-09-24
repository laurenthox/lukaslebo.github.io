function Brick(x,y,lifes) {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.brickW = 30;
    this.brickH = 15;
    this.posX = x;
    this.posY = y;
    this.isHit = false;
    // this.color = ['#0004ff','#e500ff','#ff7b00'];
    this.color = [['#000b66','#0008ff','#0061ff','#008cff','#96cfff'],
                    ['#8e1818','#ff4c00','#ff7200','#ffa100','#ffc159'],
                    ['#4a0059','#760c8c','#a50b93','#ff00e1','#ff93f2']];
    this.lifes = (lifes>1 && lifes<=3 && typeof(lifes)=='number')? lifes:1;
}

Brick.prototype.draw = function() {
    if (this.isHit) {
        return;
    }
    var x = this.posX;
    var y = this.posY;
    var dx = this.brickW/16;
    var dy = this.brickH/8;
    var c = this.lifes-1;
    this.ctx.fillStyle = this.color[c][0];
    this.ctx.fillRect(x,y,16*dx,8*dy);
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color[c][2];
    this.ctx.fillRect(x,y,8*dx,1*dy);
    this.ctx.fillStyle = this.color[c][3];
    this.ctx.fillRect(x+8*dx,y,4*dx,1*dy);
    this.ctx.fillStyle = this.color[c][4];
    this.ctx.fillRect(x+12*dx,y,4*dx,7*dy);
    this.ctx.fillStyle = this.color[c][1];
    this.ctx.fillRect(x+1*dx,y+1*dy,14*dx,6*dy);
    this.ctx.fillRect(x+15*dx,y+7*dy,1*dx,1*dy);
    this.ctx.fillStyle = this.color[c][0];
    this.ctx.fillRect(x+2*dx,y+4*dy,3*dx,1*dy);
    this.ctx.fillRect(x+12*dx,y+3*dy,2*dx,1*dy);
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
        if (ballOnFire>0) {
            this.lifes = 0;
            this.isHit = true;
            arr.push(true); // brick killed true
            return arr;
        }
        this.lifes--;
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