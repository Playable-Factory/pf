// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Sprite, utils } from "pixi.js-legacy";

import GameObject from "pf.js/src/2d/gameobjects/gameObject";


const TextureCache = utils.TextureCache;

class Image extends GameObject {
	constructor(x, y, texture) {
		let pixiObj = new Sprite.from(texture);
		super(pixiObj, x, y);

        pixiObj.gameObject = this;

		if(!TextureCache[texture]){
			console.warn("Texture not found: " + texture);
		}
	}

	//TEXTURE
	setTexture(texture) {
		if(!TextureCache[texture]){
			console.warn("Texture not found: " + texture);
			return;
		}
		this.pixiObj.texture = TextureCache[texture];
	}
	set texture(texture) {
		this.setTexture(texture);
	}
	get texture() {
		return this.pixiObj.texture;
	}

	//DIMENSIONS - WIDTH
	set width(width) {
		this.pixiObj.width = width;
	}
	get width() {
		return this.pixiObj.texture.orig.width;
	}

	set displayWidth(width) {
		this.pixiObj.width = width;
	}

	get displayWidth() {
		return this.pixiObj.width;
	}

	//DIMENSIONS - HEIGHT
	set height(height) {
		this.pixiObj.height = height;
	}
	get height() {
		return this.pixiObj.texture.orig.height;
	}

	set displayHeight(height) {
		this.pixiObj.height = height;
	}

	get displayHeight() {
		return this.pixiObj.height;
	}
	
	
}


export default Image;
