// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { NineSlicePlane } from "pixi.js-legacy";

import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import objectTypes from "./objectTypes";

/**
 * Represents a nine-slice game object.
 * @class
 * @extends GameObject
 */
class NineSlice extends GameObject {
	/**
	 * Creates a new NineSlice object.
	 * @constructor
	 * @param {number} x - The x-coordinate of the object.
	 * @param {number} y - The y-coordinate of the object.
	 * @param {string} texture - The texture to use for the object.
	 * @param {number} width - The width of the object.
	 * @param {number} height - The height of the object.
	 * @param {number} left - The size of the left slice.
	 * @param {number} right - The size of the right slice.
	 * @param {number} top - The size of the top slice.
	 * @param {number} bottom - The size of the bottom slice.
	 */
	constructor(x, y, texture, width, height, left, right, top, bottom) {
		// Retrieve the texture from the TextureCache using the provided texture parameter.
		let t = pfGlobals.TextureCache[texture];

		// Create a new NineSlicePlane object using the retrieved texture and the provided edge values.
		let pixiObj = new NineSlicePlane(t, left, right, top, bottom);

		// Call the super constructor of the GameObject class, passing in the newly created NineSlicePlane object, as well as the x and y coordinates.
		super(pixiObj, x, y);

		// Set the width and height of the NineSlicePlane object to the provided width and height parameters.
		pixiObj.width = width;
		pixiObj.height = height;

		// Set the gameObject property of the NineSlicePlane object to this, which refers to the newly created NineSlice object.
		pixiObj.gameObject = this;

		// Set two properties of the NineSlice object: isNineSlice to true, and type to objectTypes.NINESLICE.
		this.isNineSlice = true;
		this.type = objectTypes.NINESLICE;
	}
}

export default NineSlice;
