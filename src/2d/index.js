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
import Circle from "./gameobjects/shape/circle";
import NineSlice from "./gameobjects/nineslice";
import Scene from "./gameobjects/scene";
import Stage from "./gameobjects/stage";
import Viewport from "./gameobjects/viewport";

/**
 * The `gx` class provides methods for initializing the game scene and adding game objects.
 */
/**
 * A class for initializing the game stage and setting up various global variables.
 * @class
 */
class pf2D {
	/**
	 * Initialize the game stage and setup various global variables.
	 * @param {PIXI.Application} pixiApp - The PIXI application instance.
	 * @param {Object} editorConfig - The editor configuration object.
	 * @param {Object} TextureCache - The PIXI texture cache.
	 * @param {Object} Resources - The PIXI loader resources.
	 * @returns {Stage} The created game stage.
	 */
	static init(pixiApp, editorConfig, TextureCache, Resources) {
		let pixiStage = new Stage();
		pixiStage.interactive = true;
		pixiStage.sortableChildren = true;
		pixiApp.stage.addChild(pixiStage.pixiObj);
		this.stage = pixiStage;

		pfGlobals.pf2D = this;
		pfGlobals.pixiStage = pixiStage;

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

		/**
		 * Scene Controller
		 * @type {SceneController}
		 */
		this.scene = new SceneController(pixiStage, editorConfig);

		/**
		 * Factory for creating game objects and adding them to the stage.
		 * @type {GameObjectFactory}
		 */
		this.add = new GameObjectFactory(pixiStage);
		/**
		 * Utility methods for game development.
		 * @type {Utils}
		 */
		this.utils = new Utils();

		return pixiStage;
	}
}
export default pf2D;
