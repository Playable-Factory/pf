import GameObjectFactory from "./factory";
import Container from "./container";
import objectTypes from "./objectTypes";

class Scene extends Container {
	constructor(x, y) {
		super(x, y);

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
