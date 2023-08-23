import { Viewport as PixiViewport } from "pixi-viewport";

class Viewport extends PixiViewport {
	constructor(options) {
		super(options);
	}

	addChild(child) {
		super.addChild(child.pixiObj);
	}
}

export default Viewport;
