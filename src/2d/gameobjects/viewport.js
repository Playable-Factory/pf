import objectTypes from "./objectTypes";
import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import { Viewport as PixiViewport } from "pixi-viewport";

// class Viewport extends PixiViewport {
/**
 * Represents a viewport game object.
 * @extends GameObject
 */
class Viewport extends GameObject {
	/**
	 * Creates a new Viewport instance.
	 * @param {Object} options - The options for the viewport.
	 * @param {PIXI.interaction.InteractionManager} options.interaction - The interaction manager for the viewport.
	 */
	constructor(options) {
		options.interaction = pfGlobals.pixiApp.renderer.plugins.interaction;
		let pixiObj = new PixiViewport(options);
		super(pixiObj, 0, 0);

		this.pixiObj = pixiObj;
		pixiObj.gameObject = this;

		this.isViewport = true;
		this.type = objectTypes.VIEWPORT;
	}

	/**
	 * Enables dragging for the viewport.
	 * @returns {Viewport} The Viewport instance.
	 */
	drag() {
		this.pixiObj.drag();
		return this;
	}

	/**
	 * Enables pinching for the viewport.
	 * @returns {Viewport} The Viewport instance.
	 */
	pinch() {
		this.pixiObj.pinch();
		return this;
	}

	/**
	 * Enables wheel scrolling for the viewport.
	 * @returns {Viewport} The Viewport instance.
	 */
	wheel() {
		this.pixiObj.wheel();
		return this;
	}

	/**
	 * Enables deceleration for the viewport.
	 * @returns {Viewport} The Viewport instance.
	 */
	decelerate() {
		this.pixiObj.decelerate();
		return this;
	}

	/**
	 * Clamps the viewport position.
	 * @param {Object} options - The options for clamping.
	 * @returns {Viewport} The Viewport instance.
	 */
	clamp(options) {
		this.pixiObj.clamp(options);
		return this;
	}

	/**
	 * Clamps the viewport zoom.
	 * @param {Object} options - The options for clamping.
	 * @returns {Viewport} The Viewport instance.
	 */
	clampZoom(options) {
		this.pixiObj.clampZoom(options);
		return this;
	}

	/**
	 * Moves the center of the viewport to the specified position.
	 * @param {number} x - The x-coordinate of the center.
	 * @param {number} y - The y-coordinate of the center.
	 * @returns {Viewport} The Viewport instance.
	 */
	moveCenter(x, y) {
		this.pixiObj.moveCenter(x, y);
		return this;
	}
}

export default Viewport;
