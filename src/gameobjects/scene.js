import Container from "./container";
import objectTypes from "./objectTypes";

class Scene extends Container {
	constructor(x, y) {
		super(x, y);

		this.isScene = true;
		this.type = objectTypes.SCENE;
	}
}

export default Scene;
