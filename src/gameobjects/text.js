// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Sprite, utils } from "pixi.js-legacy";

import GameObject from "./gameObject";
import pfGlobals from "pf.js/src/pfGlobals";
import objectTypes from "./objectTypes";

class Text extends GameObject {
	constructor(x, y, text = "", style = {}) {
		let pixiObj = new PIXI.Text(text, style);
		super(pixiObj, x, y);
		pixiObj.gameObject = this;

		this.isText = true;
		this.type = objectTypes.TEXT;
	}
	///SET TEXT
	set text(text) {
		this.pixiObj.text = text;
	}

	get text() {
		return this.pixiObj.text;
	}

	setText(text) {
		this.pixiObj.text = text;
	}

	//SET STYLE
	set style(style) {
		this.pixiObj.style = style;
	}

	get style() {
		return this.pixiObj.style;
	}

	set color(color) {
		this.pixiObj.style.fill = color;
	}

	get color() {
		return this.pixiObj.style.fill;
	}

	set resolution(value) {
		this.pixiObj.resolution = value;
	}

	get resolution() {
		return this.pixiObj.resolution;
	}
}

export default Text;
