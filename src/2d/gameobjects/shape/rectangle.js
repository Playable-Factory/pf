// import GameObject from "../gameObject";
// import objectTypes from "../objectTypes";

// class Rectangle extends GameObject {
// 	constructor(x, y, width = 100, height = 100, color = 0x000000) {
// 		let pixiObj = new PIXI.Graphics();
// 		pixiObj.beginFill(color);
// 		pixiObj.drawRect(0, 0, width, height);
// 		pixiObj.endFill();

// 		super(pixiObj, x, y);
// 		pixiObj.gameObject = this;

// 		this.isRectangle = true;
// 		this.type = objectTypes.RECTANGLE;
// 	}
// }

// export default Rectangle;




import GameObject from "pff.js/src/2d/gameobjects/gameObject";
import objectTypes from "pff.js/src/2d/gameobjects/objectTypes";

/**
 * Represents a rectangle game object.
 * @extends GameObject
 */
/**
 * Represents a rectangle game object.
 * @extends GameObject
 */
class Rectangle extends GameObject {
	/**
	 * Creates a new Rectangle object.
	 * @param {number} x - The x coordinate of the rectangle.
	 * @param {number} y - The y coordinate of the rectangle.
	 * @param {number} [width=100] - The width of the rectangle.
	 * @param {number} [height=100] - The height of the rectangle.
	 * @param {number} [color=0x000000] - The color of the rectangle in hexadecimal format.
	 */

	constructor(x, y, width = 100, height = 100, color = 0x000000) {
		let pixiObj = new PIXI.Graphics();
		super(pixiObj, x, y);

		this.baseWidth = width;
		this.baseHeight = height;
		this._color = color;
		this.pixiObj = pixiObj;
		this.draw();

		pixiObj.gameObject = this;

		this.isRectangle = true;
		this.type = objectTypes.RECTANGLE;

		this.setOrigin(0.5, 0.5);
	}

	/**
	 * Draws the rectangle with the current width, height and color.
	 */
	draw() {
		this.clear();
		this.pixiObj.beginFill(this._color);
		this.pixiObj.drawRect(0, 0, this.baseWidth, this.baseHeight);
		this.pixiObj.endFill();
	}

	/**
	 * Sets the width of the rectangle.
	 * @param {number} width - The new width of the rectangle.
	 */
	setWidth(width) {
		this.baseWidth = width;
		this.draw();
	}

	/**
	 * Sets the height of the rectangle.
	 * @param {number} height - The new height of the rectangle.
	 */
	setHeight(height) {
		this.baseHeight = height;
		
		this.draw();
	}

	/**
	 * Sets the color of the rectangle.
	 * @param {number} color - The new color of the rectangle in hexadecimal format.
	 */
	setColor (color)
	{
		this._color = color;
		this.draw();
	}

	// /**
	//  * Sets the width of the rectangle.
	//  * @param {number} width - The new width of the rectangle.
	//  */
	// set width (width)
	// {	
	// 	super.displayWidth = width;
	// 	console.warn(super.width);
	// 	this._width = width;
	// 	this.draw();
	// }

	// /**
	//  * Gets the width of the rectangle.
	//  * @returns {number} The width of the rectangle.
	//  */
	// get width ()
	// {
	// 	return this._width;
	// }

	// /**
	//  * Sets the height of the rectangle.
	//  * @param {number} height - The new height of the rectangle.
	//  */
	// set height (height)
	// {
	// 	this._height = height;
	// 	this.draw();
	// }

	// /**
	//  * Gets the height of the rectangle.
	//  * @returns {number} The height of the rectangle.
	//  */
	// get height ()
	// {
	// 	return this._height;
	// }

	/**
	 * Sets the color of the rectangle.
	 * @param {number} color - The new color of the rectangle in hexadecimal format.
	 */
	set color (color)
	{
		this.setColor(color);
	}

	/**
	 * Gets the color of the rectangle.
	 * @returns {number} The color of the rectangle in hexadecimal format.
	 */
	get color ()
	{
		return this._color;
	}

	/**
	 * Clears the rectangle.
	 */
	clear ()
	{
		this.pixiObj.clear();
	}
}

export default Rectangle;


