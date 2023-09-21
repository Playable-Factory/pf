import GameObject from "../gameObject";
import objectTypes from "../objectTypes";

/**
 * Represents a circle game object.
 * @extends GameObject
 */
class Circle extends GameObject {
	/**
	 * Creates a new Circle instance.
	 * @constructor
	 * @param {number} x - The x-coordinate of the circle's center.
	 * @param {number} y - The y-coordinate of the circle's center.
	 * @param {number} [radius=50] - The radius of the circle.
	 * @param {number} [color=0x000000] - The color of the circle in hexadecimal format.
	 */
	constructor(x, y, radius = 50, color = 0x000000) {
		let pixiObj = new PIXI.Graphics();
		super(pixiObj, x, y);

		this.baseHeight = radius * 2;
		this.baseWidth = radius * 2;

		this._radius = radius;
		this._color = color;

		
		pixiObj.gameObject = this;

		this.pixiObj = pixiObj;
		this.isCircle = true;
		this.type = objectTypes.CIRCLE;

		this.draw();

		this.setOrigin(0.5, 0.5);
	}

	/**
	 * Draws the circle with the current radius and color.
	 */
	draw() {
		this.clear();
		this.pixiObj.beginFill(this._color);
		this.pixiObj.drawCircle(this._radius, this._radius, this._radius);
		this.pixiObj.endFill();
	}

	/**
	 * Changes the radius of the circle.
	 * @param {number} radius - The new radius of the circle.
	 */
	changeRadius(radius) {
		this._radius = radius;
		this.draw();
	}

	/**
	 * Sets the radius of the circle.
	 * @param {number} radius - The new radius of the circle.
	 */
	set radius (radius)
	{
		this.baseWidth = radius * 2;
		this.baseHeight = radius * 2;
		this._radius = radius;
		this.draw();
	}

	/**
	 * Gets the radius of the circle.
	 * @returns {number} The radius of the circle.
	 */
	get radius ()
	{
		
		return this._radius;
	}

	/**
	 * Changes the color of the circle.
	 * @param {number} color - The new color of the circle in hexadecimal format.
	 */
	setColor(color) {
		this._color = color;
		this.draw();
	}

	/**
	 * Sets the color of the circle.
	 * @param {number} color - The new color of the circle in hexadecimal format.
	 */
	set color(color) {
		this.setColor(color);
	}

	/**
	 * Gets the color of the circle.
	 * @returns {number} The color of the circle in hexadecimal format.
	 */
	get color() {
		return this._color;
	}

	/**
	 * Clears the circle.
	 */
	clear() {
		this.pixiObj.clear();
	}
}

export default Circle;
