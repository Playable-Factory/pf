// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Texture, utils } from "pixi.js-legacy";

import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import objectTypes from "./objectTypes";
/**
 * Represents a sprite game object.
 * @class
 * @extends GameObject
 */
class Sprite extends GameObject {
	/**
	 * Creates a new Sprite object.
	 * @constructor
	 * @param {number} x - The x-coordinate of the sprite.
	 * @param {number} y - The y-coordinate of the sprite.
	 * @param {string} texture - The texture of the sprite.
	 */
	constructor(x, y, texture) {
		// let useTexture = texture ? Texture.from(texture) : Texture.WHITE;
		let useTexture = texture ? pfGlobals.TextureCache[texture] : Texture.WHITE;
		if (!useTexture) { 
			console.warn("Texture not found: " + texture);
			useTexture = Texture.WHITE;
		}
		let pixiObj = new PIXI.Sprite(useTexture);
		super(pixiObj, x, y);
		this.textureName = texture;

		pixiObj.gameObject = this;

		if (!pfGlobals.TextureCache[texture]) {
			console.warn("Texture not found: " + texture);
		}
		this.isSprite = true;
		this.type = objectTypes.SPRITE;
	}

	/**
	 * Sets the texture of the sprite.
	 * @param {string} texture - The texture of the sprite.
	 */
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

	/**
	 * Sets the texture of the sprite.
	 * @param {string} texture - The texture of the sprite.
	 */
	set texture(texture) {
		this.setTexture(texture);
	}

	/**
	 * Gets the texture of the sprite.
	 * @returns {Texture} The texture of the sprite.
	 */
	get texture() {
		return this.pixiObj.texture;
	}

	/**
	 * Sets the name of the texture of the sprite.
	 * @param {string} textureName - The name of the texture of the sprite.
	 */
	set textureName(textureName) {
		this._textureName = textureName;
	}

	/**
	 * Gets the name of the texture of the sprite.
	 * @returns {string} The name of the texture of the sprite.
	 */
	get textureName() {
		return this._textureName;
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

export default Sprite;