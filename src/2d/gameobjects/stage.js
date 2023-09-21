import GameObjectFactory from "./factory";
import Container from "./container";
import objectTypes from "./objectTypes";

/**
 * Represents a stage in a 2D game.
 * @extends Container
 */
class Stage extends Container {
	/**
	 * Creates a new Stage object.
	 * @param {number} x - The x coordinate of the stage.
	 * @param {number} y - The y coordinate of the stage.
	 */
	constructor(x, y) {
		super(x, y);

		this.pixiObj.gameObject = this;
		this.isStage = true;
		this.type = objectTypes.STAGE;

		/**
		 * Game Object Factory
		 * @type {GameObjectFactory}
		 */
		this.add = new GameObjectFactory(this);
	}

	/**
	 * Adds a child to the stage.
	 * @param {PIXI.DisplayObject} child - The child to add to the stage.
	 */
	addChild(child) {
		super.addChild(child);
	}

	/**
	 * Adds a PIXI object as a child to the stage.
	 * @param {PIXI.DisplayObject} pixiObj - The PIXI object to add as a child to the stage.
	 */
	addChildPixi(pixiObj) {
		this.pixiObj.addChild(pixiObj);
	}
}

export default Stage;
