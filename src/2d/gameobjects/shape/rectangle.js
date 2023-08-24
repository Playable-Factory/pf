import GameObject from "../gameObject";
import objectTypes from "../objectTypes";

class Rectangle extends GameObject {
	constructor(x, y, width = 100, height = 100, color = 0x000000) {
		let pixiObj = new PIXI.Graphics();
		pixiObj.beginFill(color);
		pixiObj.drawRect(0, 0, width, height);
		pixiObj.endFill();

		super(pixiObj, x, y);
		pixiObj.gameObject = this;

		this.isRectangle = true;
		this.type = objectTypes.RECTANGLE;
	}
}

export default Rectangle;
