import GameObjectFactory from "./factory";
import Container from "./container";
import objectTypes from "./objectTypes";

/**
 * Represents a scene in a 2D game.
 * @extends Container
 */
class Scene extends Container {
	/**
	 * Creates a new Scene object.
	 * @param {string} name - The name of the scene.
	 */
	constructor(name) {
		super(0, 0);

		this.name = name;
		this.entityList = [];
		this.objList = [];

		this.objects = [];
		this.uuid = "";
		this.viewportData = {};

		this.pixiObj.gameObject = this;
		this.isScene = true;
		this.type = objectTypes.SCENE;

		/**
		 * Game Object Factory
		 * @type {GameObjectFactory}
		 */
		this.add = new GameObjectFactory(this);
	}

	/**
	 * Adds a child to the scene.
	 * @param {PIXI.DisplayObject} child - The child to add.
	 */
	addChild(child) {
		super.addChild(child);
	}

	/**
	 * Adds a PIXI object as a child to the scene.
	 * @param {PIXI.DisplayObject} pixiObj - The PIXI object to add.
	 */
	addChildPixi(pixiObj) {
		this.pixiObj.addChild(pixiObj);
	}
}

export default Scene;
