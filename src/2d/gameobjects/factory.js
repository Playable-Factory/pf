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
import Rectangle from "./shape/rectangle";

class GameObjectFactory {
	constructor(scene) {
		/** @type {Scene} */
		this.scene = scene;
	}

	/**
	 * Adds a sprite game object
	 *
	 * @method GearboxStudio.GameObjects.Factory#sprite
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the sprite.
	 * @param {number} y - Y position of the sprite.
	 * @param {string} texture - Texture key of the sprite.
	 *
	 * @return {Sprite} Sprite GameObject.
	 */
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

	/**
	 * Adds an animated sprite game object
	 *
	 * @method GearboxStudio.GameObjects.Factory#animatedSprite
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the sprite.
	 * @param {number} y - Y position of the sprite.
	 * @param {string} animKey - Animation key of the sprite.
	 * @param {boolean} autoplay - Whether to play the animation immediately.
	 * @param {boolean} loop - Whether to loop the animation.
	 *
	 * @return {AnimatedSprite} Animated Sprite GameObject.
	 */
	animatedSprite(x, y, animKey, autoplay = true, loop = false) {
		let aSprite = new AnimatedSprite(x, y, animKey, autoplay, loop);
		this.scene.addChild(aSprite);
		return aSprite;
		// return new Sprite(this.scene, x, y, texture);
	}

	/**
	 * Adds a new scene
	 *
	 * @method GearboxStudio.GameObjects.Factory#scene
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the scene.
	 * @param {number} y - Y position of the scene.
	 *
	 * @return {Scene} Scene.
	 */
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

	rectangle(x, y, width, height, color) {
		let rect = new Rectangle(x, y, width, height, color);
		this.scene.addChild(rect);
		return rect;
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
