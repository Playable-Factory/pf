import { AnimatedSprite, utils } from "pixi.js-legacy";

import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";

class ASprite extends GameObject {
	constructor(x, y, animKey, autoplay = true, loop = false) {
		let atlasUUID = pfGlobals.allAnims[animKey];
		if (!atlasUUID) {
			console.warn("Animation not found: " + animKey);
		}

		let textures = pfGlobals.Resources[atlasUUID].animations[animKey];
		let pixiObj = new AnimatedSprite(textures);
		super(pixiObj, x, y);

		pixiObj.gameObject = this;

		autoplay && this.play(null, loop);
	}

	//TEXTURE
	play(animKey, loop) {
		if (animKey) {
			let atlasUUID = pfGlobals.allAnims[animKey];
			this.pixiObj.textures = pfGlobals.Resources[atlasUUID].animations[animKey];

			this.baseWidth = this.pixiObj.texture.orig.width;
			this.baseHeight = this.pixiObj.texture.orig.height;
		}

		this.pixiObj.play();
		this.pixiObj.loop = loop;
	}

	//TIMESCALE
	set timescale(value) {
		this.pixiObj.timeScale = value;
	}
	get timescale() {
		return this.pixiObj.timeScale;
	}

	setTimeScale(value) {
		this.pixiObj.timeScale = value;
	}
}

export default ASprite;
