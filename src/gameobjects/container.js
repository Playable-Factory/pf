// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Sprite, utils } from "pixi.js-legacy";

import GameObject from "./gameObject";
import pfGlobals from "pf.js/src/pfGlobals";

class Container extends GameObject {
	constructor(x, y, texture) {
		let pixiObj = new PIXI.Container();
		super(pixiObj, x, y);

		pixiObj.gameObject = this;
        
	}
    
}

export default Container;
