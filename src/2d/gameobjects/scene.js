import GameObjectFactory from "./factory";
import Container from "./container";
import objectTypes from "./objectTypes";

class Scene extends Container {
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

	addChild(child) {
		super.addChild(child);
	}

	addChildPixi(pixiObj) {
		this.pixiObj.addChild(pixiObj);
	}
}

export default Scene;
