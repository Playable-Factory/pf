import objectTypes from "./objectTypes";
import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import { Viewport as PixiViewport } from "pixi-viewport";

// class Viewport extends PixiViewport {
class Viewport extends GameObject {
	constructor(options) {
		options.interaction = pfGlobals.pixiApp.renderer.plugins.interaction;
		let pixiObj = new PixiViewport(options);
		super(pixiObj, 0, 0);

		this.pixiObj = pixiObj;
		pixiObj.gameObject = this;

		this.isViewport = true;
		this.type = objectTypes.VIEWPORT;
	}

	drag() {
		this.pixiObj.drag();
		return this;
	}

	pinch() {
		this.pixiObj.pinch();
		return this;
	}

	wheel() {
		this.pixiObj.wheel();
		return this;
	}

	decelerate() {
		this.pixiObj.decelerate();
		return this;
	}

	clamp(options) {
		this.pixiObj.clamp(options);
		return this;
	}

	clampZoom(options) {
		this.pixiObj.clampZoom(options);
		return this;
	}

	moveCenter(x, y) {
		this.pixiObj.moveCenter(x, y);
		return this;
	}
}

export default Viewport;
