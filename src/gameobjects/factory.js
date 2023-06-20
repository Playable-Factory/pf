import Container from "./container";
import ASprite from "./animatedSprite";
import Image from "./image";
import Text from "./text";

class GameObjectFactory {
	constructor(scene) {
		this.scene = scene;
	}

	sprite(x, y, texture) {
		let img = new Image(x, y, texture);
		this.scene.addChild(img.pixiObj);
		return img;
	}

	animatedSprite(x, y, animKey) {
		let aSprite = new ASprite(x, y, animKey);
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
}

export default GameObjectFactory;
