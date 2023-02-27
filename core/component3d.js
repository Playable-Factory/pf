import ComponentBase from "./componentBase";
import { Object3D } from "three";

class Component3d extends ComponentBase {
	/**@type{Object3D} */
	get node() {
		return this._node;
	}
}

export default Component3d;
