// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";

import GameObject from "./gameObject";
import objectTypes from "./objectTypes";

/**
 * Represents a text game object.
 * @extends GameObject
 */
class Text extends GameObject {
	/**
	 * Creates a new Text game object.
	 * @param {number} x - The x coordinate of the text object.
	 * @param {number} y - The y coordinate of the text object.
	 * @param {string} [text=""] - The text content of the object.
	 * @param {Object} [style={}] - The style object of the text object.
	 */
	constructor(x, y, text = "", style = {}) {
		let pixiObj = new PIXI.Text(text, style);
		super(pixiObj, x, y);
		pixiObj.gameObject = this;

		this.isText = true;
		this.type = objectTypes.TEXT;
	}

	/**
	 * Sets the text content of the object.
	 * @param {string} text - The text content to set.
	 */
	set text(text) {
		this.pixiObj.text = text;
	}

	/**
	 * Gets the text content of the object.
	 * @returns {string} The text content of the object.
	 */
	get text() {
		return this.pixiObj.text;
	}

	/**
	 * Sets the text content of the object.
	 * @param {string} text - The text content to set.
	 */
	setText(text) {
		this.pixiObj.text = text;
	}

	/**
	 * Sets the style object of the text object.
	 * @param {Object} style - The style object to set.
	 */
	set style(style) {
		this.pixiObj.style = style;
	}

	/**
	 * Gets the style object of the text object.
	 * @returns {Object} The style object of the text object.
	 */
	get style() {
		return this.pixiObj.style;
	}

	/**
	 * Sets the color of the text object.
	 * @param {string} color - The color to set.
	 */
	set color(color) {
		this.pixiObj.style.fill = color;
	}

	/**
	 * Gets the color of the text object.
	 * @returns {string} The color of the text object.
	 */
	get color() {
		return this.pixiObj.style.fill;
	}

	/**
	 * Sets the fill color of the text object.
	 * @param {string} color - The fill color to set.
	 */
	set fill(color) {
		this.pixiObj.style.fill = color;
	}

	/**
	 * Gets the fill color of the text object.
	 * @returns {string} The fill color of the text object.
	 */
	get fill() {
		return this.pixiObj.style.fill;
	}

	/**
	 * Sets the resolution of the text object.
	 * @param {number} value - The resolution value to set.
	 */
	set resolution(value) {
		this.pixiObj.resolution = value;
	}

	/**
	 * Gets the resolution of the text object.
	 * @returns {number} The resolution of the text object.
	 */
	get resolution() {
		return this.pixiObj.resolution;
	}
}

export default Text;
