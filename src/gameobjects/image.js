// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Sprite, Texture, utils } from "pixi.js-legacy";

import GameObject from "./gameObject";
import pfGlobals from "pf.js/src/pfGlobals";

class Image extends GameObject {
	constructor(x, y, texture) {
		let useTexture = texture ? Texture.from(texture) : Texture.WHITE;
		let pixiObj = new Sprite(useTexture);
		super(pixiObj, x, y);

		pixiObj.gameObject = this;

		if (!pfGlobals.TextureCache[texture]) {
			console.warn("Texture not found: " + texture);
		}
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
	}
	set texture(texture) {
		this.setTexture(texture);
	}
	get texture() {
		return this.pixiObj.texture;
	}

	// //DIMENSIONS - WIDTH
	// set width(width) {
	// 	this.pixiObj.width = width;
	// }
	// get width() {
	// 	return this.pixiObj.texture.orig.width;
	// }

	// set displayWidth(width) {
	// 	this.pixiObj.width = width;
	// }

	// get displayWidth() {
	// 	return this.pixiObj.width;
	// }

	// //DIMENSIONS - HEIGHT
	// set height(height) {
	// 	this.pixiObj.height = height;
	// }
	// get height() {
	// 	return this.pixiObj.texture.orig.height;
	// }

	// set displayHeight(height) {
	// 	this.pixiObj.height = height;
	// }

	// get displayHeight() {
	// 	return this.pixiObj.height;
	// }
}

export default Image;
