// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Sprite, utils } from "pixi.js-legacy";

import GameObject from "pf.js/src/gameobjects/gameObject";
import pfGlobals from "pf.js/src/pfGlobals";

class Graphics extends GameObject {
	constructor(x, y) {
		let pixiObj = new PIXI.Graphics();
		super(pixiObj, x, y);
		pixiObj.gameObject = this;
	}
	
    lineStyle(lineWidth, color, alpha) {
        this.pixiObj.lineStyle(lineWidth, color, alpha);
        return this;
    }
    beginFill(color, alpha) {
        this.pixiObj.beginFill(color, alpha);
        return this;
    }
    endFill() {
        this.pixiObj.endFill();
        return this;
    }
    drawRect(x, y, width, height) {
        this.pixiObj.drawRect(x, y, width, height);
        return this;
    }
    drawRoundedRect(x, y, width, height, radius) {
        this.pixiObj.drawRoundedRect(x, y, width, height, radius);
        return this;
    }
    drawCircle(x, y, radius) {
        this.pixiObj.drawCircle(x, y, radius);
        return this;
    }
    drawPolygon(path) {
        this.pixiObj.drawPolygon(path);
        return this;
    }
    drawEllipse(x, y, width, height) {
        this.pixiObj.drawEllipse(x, y, width, height);
        return this;
    }
    clear() {
        this.pixiObj.clear();
        return this;
    }

}

export default Graphics;
