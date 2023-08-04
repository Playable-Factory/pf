// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Sprite, utils } from "pixi.js-legacy";
import { Spine } from "pixi-spine";

import GameObject from "./gameObject";
import pfGlobals from "pf.js/src/pfGlobals";

class PfSpine extends GameObject {
	constructor(x, y, spineName, skinName, animName, loop) {
		if (!pfGlobals.TextureCache[spineName]) {
			console.warn("Spine not found: " + spineName);
		}
		let pixiObj = new Spine(pfGlobals.TextureCache[spineName].spineData);
		super(pixiObj, x, y);
		pixiObj.gameObject = this;

		this.setSkinByName(skinName || "default");

		if (animName) {
			this.play(animName, loop);
		}
	}

	setSkinByName(skinName) {
		this.pixiObj.skeleton.setSkinByName(skinName);
		this.baseWidth = this.pixiObj.width;
		this.baseHeight = this.pixiObj.height;
		return this;
	}
	play(animName, loop) {
		this.pixiObj.state.setAnimation(0, animName, loop);
		return this;
	}

	set timescale(value) {
		this.pixiObj.state.timeScale = value;
	}
	get timescale() {
		return this.pixiObj.state.timeScale;
	}

	setTimeScale(value) {
		this.pixiObj.state.timeScale = value;
		return this;
	}
}

export default PfSpine;
