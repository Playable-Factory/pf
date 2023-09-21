/**
 * Represents the scale of a game object in 2D space.
 * @class
 */
class Scale {
	/**
	 * Creates a new Scale instance.
	 * @param {GameObject} gameObject - The game object to which this scale belongs.
	 */
	constructor(gameObject) {
		this.gameObject = gameObject;

	}

	/**
	 * Sets the x and y scale of the game object.
	 * @param {number} x - The x scale value.
	 * @param {number} y - The y scale value.
	 */
	set (x, y)
	{
		this.gameObject.setScale(x, y);
	}

	/**
	 * Gets the current scale of the game object.
	 * @returns {Object} - The current scale of the game object.
	 * @property {number} x - The x scale value.
	 * @property {number} y - The y scale value.
	 */
	get() {
		return this.gameObject.scale;
	}

	/**
	 * Sets the x scale of the game object.
	 * @param {number} value - The x scale value.
	 */
	set x(value) {
		this.gameObject.scaleX = value;
	}

	/**
	 * Gets the x scale of the game object.
	 * @returns {number} - The x scale value.
	 */
	get x() {
		return this.gameObject.scaleX;
	}

	/**
	 * Sets the y scale of the game object.
	 * @param {number} value - The y scale value.
	 */
	set y(value) {
		this.gameObject.scaleY = value;
	}

	/**
	 * Gets the y scale of the game object.
	 * @returns {number} - The y scale value.
	 */
	get y() {
		return this.gameObject.scaleY;
	}
}

export default Scale;
