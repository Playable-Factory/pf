import Container from "./container";
import AnimatedSprite from "./animatedSprite";
import Image from "./image";
import Text from "./text";
import Graphics from "./graphics";
import Spine from "./spine";
import NineSlice from "./nineslice";
import ParticleEmitter from "./particleEmitter";
import Scene from "./scene";

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
		let aSprite = new AnimatedSprite(x, y, animKey, autoplay, loop);
		this.scene.addChild(aSprite.pixiObj);
		return aSprite;
		// return new Sprite(this.scene, x, y, texture);
	}

	scene(x, y) {
		let scene = new Scene(x, y);
		return scene;
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
		let spineObj = new Spine(x, y, spineName, skinName, animName, loop);
		this.scene.addChild(spineObj.pixiObj);
		return spineObj;
	}

	graphics(x, y) {
		let graphics = new Graphics(x, y);
		this.scene.addChild(graphics.pixiObj);
		return graphics;
	}

	nineslice(x, y, texture, width, height, left, right, top, bottom) {
		let nineslice = new NineSlice(x, y, texture, width, height, left, right, top, bottom);
		this.scene.addChild(nineslice.pixiObj);
		return nineslice;
	}

	particleEmitter(x, y, particleData) {
		let emitter = new ParticleEmitter(x, y, particleData);
		this.scene.addChild(emitter.pixiObj);
		return emitter;
	}
}

export default GameObjectFactory;
