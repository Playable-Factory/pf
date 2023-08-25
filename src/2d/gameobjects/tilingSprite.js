// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Texture, utils } from "pixi.js-legacy";

import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import objectTypes from "./objectTypes";

class TilingSprite extends GameObject {
	constructor(x, y, width = 100, height = 100, texture) {
		// let useTexture = texture ? Texture.from(texture) : Texture.WHITE;
		let useTexture = texture ? pfGlobals.TextureCache[texture] : Texture.WHITE;
		let pixiObj = new PIXI.TilingSprite(useTexture, width, height);
		super(pixiObj, x, y);
		this.textureName = texture;

		pixiObj.gameObject = this;

		if (!pfGlobals.TextureCache[texture]) {
			console.warn("Texture not found: " + texture);
		}
		this.isTilingSprite = true;
		this.type = objectTypes.TILING_SPRITE;
	}

	//TEXTURE
	setTexture(texture) {
		if (!pfGlobals.TextureCache[texture]) {
			console.warn("Texture not found: " + texture);
			return;
		}
		this.pixiObj.texture = pfGlobals.TextureCache[texture];
		this.baseWidth = this.pixiObj.texture.orig.width;
		this.baseHeight = this.pixiObj.texture.orig.height;

		this.textureName = texture;
	}
	set texture(texture) {
		this.setTexture(texture);
	}
	get texture() {
		return this.pixiObj.texture;
	}

	set textureName(textureName) {
		this._textureName = textureName;
	}
	get textureName() {
		return this._textureName;
	}
}

export default TilingSprite;
