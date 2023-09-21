// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Texture, utils } from "pixi.js-legacy";

import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import objectTypes from "./objectTypes";

/**
 * Represents a tiling sprite game object.
 * @extends GameObject
 */
class TilingSprite extends GameObject {
	/**
	 * Creates a new TilingSprite object.
	 * @param {number} x - The x coordinate of the tiling sprite.
	 * @param {number} y - The y coordinate of the tiling sprite.
	 * @param {number} [width=100] - The width of the tiling sprite.
	 * @param {number} [height=100] - The height of the tiling sprite.
	 * @param {string} texture - The texture of the tiling sprite.
	 */
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

	/**
	 * Sets the texture of the tiling sprite.
	 * @param {string} texture - The texture to set.
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
	 * Sets the texture of the tiling sprite.
	 * @param {string} texture - The texture to set.
	 */
	set texture(texture) {
		this.setTexture(texture);
	}

	/**
	 * Gets the texture of the tiling sprite.
	 * @returns {PIXI.Texture} The texture of the tiling sprite.
	 */
	get texture() {
		return this.pixiObj.texture;
	}

	/**
	 * Sets the name of the texture of the tiling sprite.
	 * @param {string} textureName - The name of the texture to set.
	 */
	set textureName(textureName) {
		this._textureName = textureName;
	}

	/**
	 * Gets the name of the texture of the tiling sprite.
	 * @returns {string} The name of the texture of the tiling sprite.
	 */
	get textureName() {
		return this._textureName;
	}
}

export default TilingSprite;
