// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { NineSlicePlane } from "pixi.js-legacy";

import GameObject from "./gameObject";
import pfGlobals from "pf.js/src/pfGlobals";

class NineSlice extends GameObject {
	constructor(x, y, texture, width, height, left, right, top, bottom) {
		let t = pfGlobals.TextureCache[texture];
		let pixiObj = new NineSlicePlane(t, left, right, top, bottom);
		super(pixiObj, x, y);
		pixiObj.width = width;
		pixiObj.height = height;
		pixiObj.gameObject = this;
	}
}

export default NineSlice;
