import { Sprite } from "pixi.js-legacy";
import ComponentBase from "./componentBase";

class Component2d extends ComponentBase {
	/** @type {Sprite} */
	get node() {
		return this._node;
	}
}

export default Component2d;
