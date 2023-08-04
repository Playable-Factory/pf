import Container from "./container";
import ASprite from "./animatedSprite";
import Image from "./image";
import Text from "./text";
import PfSpine from "./spine";

class GameObjectFactory {
	constructor(scene) {
		this.scene = scene;
	}
	/** @type {Image} @return {Image}*/
	sprite(x, y, texture) {
		if (isNaN(x)) {
			texture = x;
			x = 0;
			y = 0;
		}
		let img = new Image(x, y, texture);
		this.scene.addChild(img.pixiObj);
		/** @type {Image} */
		return img;
	}

	animatedSprite(x, y, animKey, autoplay = true, loop = false) {
		let aSprite = new ASprite(x, y, animKey, autoplay, loop);
		this.scene.addChild(aSprite.pixiObj);
		return aSprite;
		// return new Sprite(this.scene, x, y, texture);
	}

	container(x, y) {
		let container = new Container(x, y);
		this.scene.addChild(container.pixiObj);
		return container;
	}

	text(x, y, text = "", style = {}) {
		let textObj = new Text(x, y, text, style);
		this.scene.addChild(textObj.pixiObj);
		return textObj;
	}

	spine(x, y, spineName, skinName, animName, loop = false) {
		let spineObj = new PfSpine(x, y, spineName, skinName, animName, loop);
		this.scene.addChild(spineObj.pixiObj);
		return spineObj;
	}
}

export default GameObjectFactory;
