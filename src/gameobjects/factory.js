import Container from "./container";
import AnimatedSprite from "./animatedSprite";
import Sprite from "./sprite";
import Text from "./text";
import Graphics from "./graphics";
import Spine from "./spine";
import NineSlice from "./nineslice";
import ParticleEmitter from "./particleEmitter";
import Scene from "./scene";
import Viewport from "./viewport";

class GameObjectFactory {
	constructor(scene) {
		/** @type {Scene} */
		this.scene = scene;
	}

	sprite(x, y, texture) {
		if (isNaN(x)) {
			texture = x;
			x = 0;
			y = 0;
		}
		let img = new Sprite(x, y, texture);
		this.scene.addChild(img);
		return img;
	}

	animatedSprite(x, y, animKey, autoplay = true, loop = false) {
		let aSprite = new AnimatedSprite(x, y, animKey, autoplay, loop);
		this.scene.addChild(aSprite);
		return aSprite;
		// return new Sprite(this.scene, x, y, texture);
	}

	scene(x, y) {
		let scene = new Scene(x, y);
		return scene;
	}

	container(x, y) {
		let container = new Container(x, y);
		this.scene.addChild(container);
		return container;
	}

	text(x, y, text = "", style = {}) {
		let textObj = new Text(x, y, text, style);
		this.scene.addChild(textObj);
		return textObj;
	}

	spine(x, y, spineName, skinName, animName, loop = false) {
		let spineObj = new Spine(x, y, spineName, skinName, animName, loop);
		this.scene.addChild(spineObj);
		return spineObj;
	}

	graphics(x, y) {
		let graphics = new Graphics(x, y);
		this.scene.addChild(graphics);
		return graphics;
	}

	nineslice(x, y, texture, width, height, left, right, top, bottom) {
		let nineslice = new NineSlice(x, y, texture, width, height, left, right, top, bottom);
		this.scene.addChild(nineslice);
		return nineslice;
	}

	particleEmitter(x, y, particleData) {
		let emitter = new ParticleEmitter(x, y, particleData);
		this.scene.addChild(emitter);
		return emitter;
	}

	viewport(options) {
		let viewport = new Viewport(options);
		this.scene.addChild(viewport);
		return viewport;
	}
}

export default GameObjectFactory;
