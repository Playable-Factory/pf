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
import Circle from "./shape/circle";
import GameObject from "./gameObject";

/**
 * Factory class for creating game objects.
 *
 * @class GameObjectFactory
 */
class GameObjectFactory {
	/**
	 * Creates an instance of GameObjectFactory.
	 * @param {GameObject} gameObject - The Game Object to which game objects will be added.
	 */
	constructor(gameObject) {
		/**
		 * The Game Object to which game objects will be added.
		 * @type {GameObject}
		 */
		this.parentGameObject = gameObject;
	}

	/**
	 * Adds a sprite game object.
	 *
	 * @method GameObjectFactory#sprite
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the sprite.
	 * @param {number} y - Y position of the sprite.
	 * @param {string} texture - Texture key of the sprite.
	 *
	 * @return {Sprite} The created Sprite game object.
	 */
	sprite(x, y, texture) {
		if (isNaN(x)) {
			texture = x;
			x = 0;
			y = 0;
		}
		let img = new Sprite(x, y, texture);
		this.parentGameObject.addChild(img);
		return img;
	}

	/**
	 * Adds an animated sprite game object.
	 *
	 * @method GameObjectFactory#animatedSprite
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the sprite.
	 * @param {number} y - Y position of the sprite.
	 * @param {string} animKey - Animation key of the sprite.
	 * @param {boolean} [autoplay=true] - Whether to play the animation immediately.
	 * @param {boolean} [loop=false] - Whether to loop the animation.
	 *
	 * @return {AnimatedSprite} The created AnimatedSprite game object.
	 */
	animatedSprite(x, y, animKey, autoplay = true, loop = false) {
		let aSprite = new AnimatedSprite(x, y, animKey, autoplay, loop);
		this.parentGameObject.addChild(aSprite);
		return aSprite;
	}

	/**
	 * Adds a new scene.
	 *
	 * @method GameObjectFactory#scene
	 * @since 1.0.0
	 *
	 * @param {string} name - The name of the scene.
	 * @return {Scene} The created Scene.
	 */
	scene(name) {
		let scene = new Scene(name);
		return scene;
	}

	/**
	 * Adds a container game object.
	 *
	 * @method GameObjectFactory#container
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the container.
	 * @param {number} y - Y position of the container.
	 *
	 * @return {Container} The created Container game object.
	 */
	container(x, y) {
		let container = new Container(x, y);
		this.parentGameObject.addChild(container);
		return container;
	}

	/**
	 * Adds a text game object.
	 *
	 * @method GameObjectFactory#text
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the text.
	 * @param {number} y - Y position of the text.
	 * @param {string} [text=""] - The text content.
	 * @param {object} [style={}] - The style configuration for the text.
	 *
	 * @return {Text} The created Text game object.
	 */
	text(x, y, text = "", style = {}) {
		let textObj = new Text(x, y, text, style);
		this.parentGameObject.addChild(textObj);
		return textObj;
	}

	/**
	 * Adds a Spine game object.
	 *
	 * @method GameObjectFactory#spine
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the Spine object.
	 * @param {number} y - Y position of the Spine object.
	 * @param {string} spineName - The name of the Spine object.
	 * @param {string} skinName - The name of the Spine object's skin.
	 * @param {string} animName - The name of the initial animation to play.
	 * @param {boolean} [loop=false] - Whether to loop the animation.
	 *
	 * @return {Spine} The created Spine game object.
	 */
	spine(x, y, spineName, skinName, animName, loop = false) {
		let spineObj = new Spine(x, y, spineName, skinName, animName, loop);
		this.parentGameObject.addChild(spineObj);
		return spineObj;
	}

	/**
	 * Adds a Graphics game object.
	 *
	 * @method GameObjectFactory#graphics
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the Graphics object.
	 * @param {number} y - Y position of the Graphics object.
	 *
	 * @return {Graphics} The created Graphics game object.
	 */
	graphics(x, y) {
		let graphics = new Graphics(x, y);
		this.parentGameObject.addChild(graphics);
		return graphics;
	}

	/**
	 * Adds a Rectangle game object.
	 *
	 * @method GameObjectFactory#rectangle
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the Rectangle object.
	 * @param {number} y - Y position of the Rectangle object.
	 * @param {number} width - Width of the Rectangle.
	 * @param {number} height - Height of the Rectangle.
	 * @param {string} color - Color of the Rectangle.
	 *
	 * @return {Rectangle} The created Rectangle game object.
	 */
	rectangle(x, y, width, height, color) {
		let rect = new Rectangle(x, y, width, height, color);
		this.parentGameObject.addChild(rect);
		return rect;
	}

	/**
	 * Adds a Rectangle game object.
	 *
	 * @method GameObjectFactory#circle
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the Circle object.
	 * @param {number} y - Y position of the Circle object.
	 * @param {number} radius - Radius of the Circle.
	 * @param {string} color - Color of the Circle.
	 *
	 * @return {Circle} The created Circle game object.
	 */
	circle(x, y, radius, color) {
		let circle = new Circle(x, y, radius, color);
		this.parentGameObject.addChild(circle);
		return circle;
	}

	/**
	 * Adds a NineSlice game object.
	 *
	 * @method GameObjectFactory#nineslice
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the NineSlice object.
	 * @param {number} y - Y position of the NineSlice object.
	 * @param {string} texture - Texture key of the NineSlice object.
	 * @param {number} width - Width of the NineSlice object.
	 * @param {number} height - Height of the NineSlice object.
	 * @param {number} left - Left size of the NineSlice object.
	 * @param {number} right - Right size of the NineSlice object.
	 * @param {number} top - Top size of the NineSlice object.
	 * @param {number} bottom - Bottom size of the NineSlice object.
	 *
	 * @return {NineSlice} The created NineSlice game object.
	 */
	nineslice(x, y, texture, width, height, left, right, top, bottom) {
		let nineslice = new NineSlice(x, y, texture, width, height, left, right, top, bottom);
		this.parentGameObject.addChild(nineslice);
		return nineslice;
	}

	/**
	 * Adds a ParticleEmitter game object.
	 *
	 * @method GameObjectFactory#particleEmitter
	 * @since 1.0.0
	 *
	 * @param {number} x - X position of the ParticleEmitter object.
	 * @param {number} y - Y position of the ParticleEmitter object.
	 * @param {object} particleData - Particle configuration data.
	 *
	 * @return {ParticleEmitter} The created ParticleEmitter game object.
	 */
	particleEmitter(x, y, particleData) {
		let emitter = new ParticleEmitter(x, y, particleData);
		this.parentGameObject.addChild(emitter);
		return emitter;
	}

	/**
	 * Adds a Viewport game object.
	 *
	 * @method GameObjectFactory#viewport
	 * @since 1.0.0
	 *
	 * @param {object} options - Viewport configuration options.
	 *
	 * @return {Viewport} The created Viewport game object.
	 */
	viewport(options) {
		let viewport = new Viewport(options);
		this.parentGameObject.addChild(viewport);
		return viewport;
	}
}

export default GameObjectFactory;
