import pfGlobals from "./pfGlobals";
import GameObjectFactory from "./gameobjects/factory";
import Utils from "./utils/utils";
import SceneController from "./core/editor/sceneController";

import Sprite from "./gameobjects/sprite";
import AnimatedSprite from "./gameobjects/animatedSprite";
import Container from "./gameobjects/container";
import Text from "./gameobjects/text";
import GameObject from "./gameobjects/gameObject";
import Spine from "./gameobjects/spine";
import Graphics from "./gameobjects/graphics";
import Rectangle from "./gameobjects/shape/rectangle";
import NineSlice from "./gameobjects/nineslice";
import Scene from "./gameobjects/scene";
import Viewport from "./gameobjects/viewport";

/**
 * The `gx` class provides methods for initializing the game scene and adding game objects.
 */
class gx {
	/**
	 * Initialize the game scene and setup various global variables.
	 * @param {PIXI.Application} pixiApp - The PIXI application instance.
	 * @param {Object} editorConfig - The editor configuration object.
	 * @param {Object} TextureCache - The PIXI texture cache.
	 * @param {Object} Resources - The PIXI loader resources.
	 * @returns {Scene} The created game scene.
	 */
	static init(pixiApp, editorConfig, TextureCache, Resources) {
		let pixiScene = new Scene();
		pixiScene.interactive = true;
		pixiScene.sortableChildren = true;
		pixiApp.stage.addChild(pixiScene.pixiObj);
		gx.scene = pixiScene;

		pfGlobals.gx = this;
		pfGlobals.pixiScene = pixiScene;

		let allAnims = {};

		for (let uuid in Resources) {
			for (let animName in Resources[uuid].animations) {
				allAnims[animName] = uuid;
			}
		}

		pfGlobals.allAnims = allAnims;
		pfGlobals.TextureCache = TextureCache;
		pfGlobals.Resources = Resources;
		pfGlobals.pixiApp = pixiApp;

		let sceneController = new SceneController(pixiScene, editorConfig);
		this.scene = sceneController;

		/**
		 * Factory for creating game objects and adding them to the scene.
		 * @type {GameObjectFactory}
		 */
		this.add = new GameObjectFactory(pixiScene);
		/**
		 * Utility methods for game development.
		 * @type {Utils}
		 */
		this.utils = new Utils(pixiScene);

		return pixiScene;
	}
}

// var gx = {
//     init: (pixiScene) => {
//         gx.scene = pixiScene;

//     },
//     add: new GameObjectFactory(),
// }

export default gx;
