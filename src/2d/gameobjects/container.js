import GameObject from "./gameObject";
import objectTypes from "./objectTypes";

/**
 * The Container class represents a game object that serves as a PIXI.js Container.
 * It can hold other display objects or containers as children.
 *
 * @extends GameObject
 */

class Container extends GameObject {
	/**
	 * Creates a new Container game object.
	 * @constructor
	 * @param {number} x - The X coordinate of the container.
	 * @param {number} y - The Y coordinate of the container.
	 */
	constructor(x, y) {
		/**
		 * The PIXI container object that this game object wraps.
		 * @type {PIXI.Container}
		 */
		let pixiObj = new PIXI.Container();
		super(pixiObj, x, y);

		// Set a reference to this game object on the PIXI container object.
		pixiObj.gameObject = this;

		/**
		 * A flag indicating that this game object is a container.
		 * @type {boolean}
		 */
		this.isContainer = true;

		/**
		 * The type of this game object (CONTAINER).
		 * @type {string}
		 */
		this.type = objectTypes.CONTAINER;
	}
}

export default Container;
