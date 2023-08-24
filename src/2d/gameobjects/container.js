import GameObject from "./gameObject";
import objectTypes from "./objectTypes";

class Container extends GameObject {
	constructor(x, y) {
		let pixiObj = new PIXI.Container();
		super(pixiObj, x, y);

		pixiObj.gameObject = this;

		this.isContainer = true;
		this.type = objectTypes.CONTAINER;
	}
}

export default Container;
