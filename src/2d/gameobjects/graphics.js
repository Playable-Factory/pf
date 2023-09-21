// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Sprite, utils } from "pixi.js-legacy";

import GameObject from "./gameObject";
import objectTypes from "./objectTypes";

/**
 * A class representing a graphics object.
 * @extends GameObject
 */
class Graphics extends GameObject {
	/**
	 * Creates a new Graphics object.
	 * @param {number} x - The x-coordinate of the object.
	 * @param {number} y - The y-coordinate of the object.
	 */
	constructor(x, y) {
		let pixiObj = new PIXI.Graphics();
		super(pixiObj, x, y);
		pixiObj.gameObject = this;

		this.isGraphics = true;
		this.type = objectTypes.GRAPHICS;
	}

	/**
	 * Sets the line style for the graphics object.
	 * @param {number} lineWidth - The width of the line.
	 * @param {number} color - The color of the line.
	 * @param {number} alpha - The alpha value of the line.
	 * @returns {Graphics} The Graphics object.
	 */
	lineStyle(lineWidth, color, alpha) {
		this.pixiObj.lineStyle(lineWidth, color, alpha);
		return this;
	}

	/**
	 * Begins a fill for the graphics object.
	 * @param {number} color - The color of the fill.
	 * @param {number} alpha - The alpha value of the fill.
	 * @returns {Graphics} The Graphics object.
	 */
	beginFill(color, alpha) {
		this.pixiObj.beginFill(color, alpha);
		return this;
	}

	/**
	 * Begins a new path for the graphics object.
	 * @returns {Graphics} The Graphics object.
	 */
	beginPath() {
		this.pixiObj.beginPath();
		return this;
	}

	/**
	 * Strokes the current path for the graphics object.
	 * @returns {Graphics} The Graphics object.
	 */
	strokePath() {
		this.pixiObj.strokePath();
		return this;
	}

	/**
	 * Moves the current drawing position to the specified point.
	 * @param {number} x - The x-coordinate of the point.
	 * @param {number} y - The y-coordinate of the point.
	 * @returns {Graphics} The Graphics object.
	 */
	moveTo(x, y) {
		this.pixiObj.moveTo(x, y);
		return this;
	}

	/**
	 * Draws a line from the current drawing position to the specified point.
	 * @param {number} x - The x-coordinate of the point.
	 * @param {number} y - The y-coordinate of the point.
	 * @returns {Graphics} The Graphics object.
	 */
	lineTo(x, y) {
		this.pixiObj.lineTo(x, y);
		return this;
	}

	/**
	 * Ends the current fill for the graphics object.
	 * @returns {Graphics} The Graphics object.
	 */
	endFill() {
		this.pixiObj.endFill();
		return this;
	}

	// bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
	//     this.pixiObj.bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY);
	//     return this;
	// }
	
	/**
	 * Draws a rectangle.
	 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
	 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
	 * @param {number} width - The width of the rectangle.
	 * @param {number} height - The height of the rectangle.
	 * @returns {Graphics} The Graphics object.
	 */
	drawRect(x, y, width, height) {
		this.pixiObj.drawRect(x, y, width, height);
		return this;
	}

	/**
	 * Draws a rounded rectangle.
	 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
	 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
	 * @param {number} width - The width of the rectangle.
	 * @param {number} height - The height of the rectangle.
	 * @param {number} radius - The radius of the corners.
	 * @returns {Graphics} The Graphics object.
	 */
	drawRoundedRect(x, y, width, height, radius) {
		this.pixiObj.drawRoundedRect(x, y, width, height, radius);
		return this;
	}

	/**
	 * Draws a circle.
	 * @param {number} x - The x-coordinate of the center of the circle.
	 * @param {number} y - The y-coordinate of the center of the circle.
	 * @param {number} radius - The radius of the circle.
	 * @returns {Graphics} The Graphics object.
	 */
	drawCircle(x, y, radius) {
		this.pixiObj.drawCircle(x, y, radius);
		return this;
	}

	/**
	 * Draws a polygon.
	 * @param {number[]} path - An array of points defining the polygon.
	 * @returns {Graphics} The Graphics object.
	 */
	drawPolygon(path) {
		this.pixiObj.drawPolygon(path);
		return this;
	}

	/**
	 * Draws an ellipse.
	 * @param {number} x - The x-coordinate of the center of the ellipse.
	 * @param {number} y - The y-coordinate of the center of the ellipse.
	 * @param {number} width - The width of the ellipse.
	 * @param {number} height - The height of the ellipse.
	 * @returns {Graphics} The Graphics object.
	 */
	drawEllipse(x, y, width, height) {
		this.pixiObj.drawEllipse(x, y, width, height);
		return this;
	}

	/**
	 * Clears the graphics object.
	 * @returns {Graphics} The Graphics object.
	 */
	clear() {
		this.pixiObj.clear();
		return this;
	}
}

export default Graphics;
