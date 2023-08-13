// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Sprite, utils } from "pixi.js-legacy";
import { Spine } from "pixi-spine";

import GameObject from "./gameObject";
import pfGlobals from "pf.js/src/pfGlobals";
import objectTypes from "./objectTypes";

class PfSpine extends GameObject {
	constructor(x, y, spineName, skinName, animName, loop) {
		if (!pfGlobals.TextureCache[spineName]) {
			console.warn("Spine not found: " + spineName);
		}
		let pixiObj = new Spine(pfGlobals.TextureCache[spineName].spineData);
		super(pixiObj, x, y);
		pixiObj.gameObject = this;

		skinName = skinName || "default";
		this.setSkinByName(skinName);

		this.spineName = spineName;

		if (animName) {
			this.play(animName, loop);
		}

		this.isSpine = true;
		this.type = objectTypes.SPINE;
	}

	setSkinByName(skinName) {
		this.pixiObj.skeleton.setSkinByName(skinName);
		this.baseWidth = this.pixiObj.width;
		this.baseHeight = this.pixiObj.height;
		this.skinName = skinName;
		return this;
	}
	play(animName, loop) {
		this.pixiObj.state.setAnimation(0, animName, loop);
		this.animName = animName;
		this.loop = loop;
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
