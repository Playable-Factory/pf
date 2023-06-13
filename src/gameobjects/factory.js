import ASprite from "./animatedSprite";
import Image from "./image";

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
}

export default GameObjectFactory;
