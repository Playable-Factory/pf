/**
 * Represents a Skew object that can be used to set or get the skew values of a game object.
 * @class
 */
class Skew {
	/**
	 * Creates a new Skew object.
	 * @constructor
	 * @param {GameObject} gameObject - The game object to set or get the skew values from.
	 */
	constructor(gameObject) {
		this.gameObject = gameObject;
	}

	/**
	 * Sets the skew values of the game object.
	 * @param {number} x - The x value of the skew.
	 * @param {number} y - The y value of the skew.
	 */
	set(x, y) {
		this.gameObject.setSkew(x, y);
	}

	/**
	 * Gets the skew values of the game object.
	 * @returns {number[]} An array containing the x and y values of the skew.
	 */
	get() {
		return this.gameObject.skew;
	}

	/**
	 * Sets the x value of the skew.
	 * @param {number} value - The x value of the skew.
	 */
	set x(value) {
		this.gameObject.skewX = value;
	}

	/**
	 * Gets the x value of the skew.
	 * @returns {number} The x value of the skew.
	 */
	get x() {
		return this.gameObject.skewX;
	}

	/**
	 * Sets the y value of the skew.
	 * @param {number} value - The y value of the skew.
	 */
	set y(value) {
		this.gameObject.skewY = value;
	}

	/**
	 * Gets the y value of the skew.
	 * @returns {number} The y value of the skew.
	 */
	get y() {
		return this.gameObject.skewY;
	}
}

export default Skew;
