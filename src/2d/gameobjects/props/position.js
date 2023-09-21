/**
 * Represents the position of a game object in 2D space.
 * @class
 */
class Position {
	/**
	 * Creates a new Position instance.
	 * @param {GameObject} gameObject - The game object to which this position belongs.
	 */
	constructor (gameObject)
	{
		this.gameObject = gameObject;
	}

	/**
	 * Sets the position of the game object.
	 * @param {number} x - The x-coordinate of the position.
	 * @param {number} y - The y-coordinate of the position.
	 */
	set (x, y)
	{
		
		this.gameObject.setPosition(x, y);
	}

	/**
	 * Gets the position of the game object.
	 * @returns {Object} The position of the game object.
	 * @property {number} x - The x-coordinate of the position.
	 * @property {number} y - The y-coordinate of the position.
	 */
	get() {
		return this.gameObject.position;
	}

	/**
	 * Sets the x-coordinate of the position.
	 * @param {number} value - The new x-coordinate value.
	 */
	set x (value)
	{
		console.log("Position.set.x", value)
		this.gameObject.positionX = value;
	}

	/**
	 * Gets the x-coordinate of the position.
	 * @returns {number} The x-coordinate of the position.
	 */
	get x() {
		return this.gameObject.positionX;
	}

	/**
	 * Sets the y-coordinate of the position.
	 * @param {number} value - The new y-coordinate value.
	 */
	set y(value) {
		this.gameObject.positionY = value;
	}

	/**
	 * Gets the y-coordinate of the position.
	 * @returns {number} The y-coordinate of the position.
	 */
	get y() {
		return this.gameObject.positionY;
	}
}

export default Position;
