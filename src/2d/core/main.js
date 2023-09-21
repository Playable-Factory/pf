import Loader2D from "./loader";
import Responsive from "./responsive";
import PostProcessing from "./utils/postprocess/postprocess";

import * as PIXI from "pixi.js-legacy";

import gsap from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
import CustomEase from "gsap/CustomEase";
import { utils, Loader, Rectangle } from "pixi.js-legacy";
import Banner from "./utils/banner";
import pf2D from "../index";
import SceneController from "pff.js/src/2d/core/editor/sceneController";

const Resources = Loader.shared.resources;

/**
 * Class representing the main 2D application.
 */
class Main2D {
	/**
	 * Create a Main2D instance.
	 * @param {object} config - The configuration options for the PIXI application.
	 * @param {object} editorConfig - The editor configuration options.
	 * @param {object} assets - The assets to load.
	 * @param {Function} readyCallback - The callback function to be called when assets are loaded and the app is ready.
	 * @param {Function} resizeCallback - The callback function to be called when the canvas is resized.
	 * @param {Function} updateCallback - The callback function to be called on each update tick.
	 */
	constructor(config, editorConfig, assets, readyCallback, resizeCallback, updateCallback) {
		this.resizeCallback = resizeCallback;
		this.updateCallback = updateCallback;
		this.editorConfig = editorConfig;

		let tempConfig = {
			width: 800,
			height: 800,
			resolution: 1, //window.devicePixelRatio || 1,
			antialias: false,
			forceCanvas: false,
		};

		config = Object.assign(tempConfig, config);

		PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2;
		const app = new PIXI.Application(config);
		let parent = document.getElementById("gameContainer") || document.body;
		parent.appendChild(app.view);

		gsap.registerPlugin(PixiPlugin, CustomEase);
		PixiPlugin.registerPIXI(PIXI);
		window.PIXI = PIXI; // for dev-tools

		app.ticker.stop();
		gsap.ticker.add((time, delta) => {
			this.update(time, delta);
			this.render();
			this.postprocess && this.postprocess.update(time, delta / 1000);
		});

		app.view.style.zIndex = 1;
		// app.stage.interactive = true;
		// app.stage.sortableChildren = true;

		this.stage = pf2D.init(app, editorConfig, utils.TextureCache, Resources);
		this.pixiApp = app;
		this.pixiStage = this.stage;
		window.stage = this.stage;

		let loader = new Loader2D();
		this.responsive = new Responsive(app, this.stage);

		loader.load(assets.normal, () => {
			this.assetsLoaded();
			setTimeout(() => {
				readyCallback();
			}, 100);
			// this.initPostProcess();
		});
	}

	/**
	 * Pause the application's update loop.
	 */
	pause() {
		gsap.ticker.sleep();
	}

	/**
	 * Resume the application's update loop.
	 */
	resume() {
		gsap.ticker.wake();
	}

	/**
	 * Update the application's logic.
	 * @param {number} time - The current time in milliseconds.
	 * @param {number} delta - The time elapsed since the last frame update.
	 */
	update(time, delta) {
		this.updateCallback && this.updateCallback(time, delta);
		pf2D.scene.update(time, delta);
	}

	/**
	 * Render the PIXI application.
	 */
	render() {
		this.pixiApp.ticker.update();
	}

	/**
	 * Initialize the top banner.
	 * @param {object} data - Data for initializing the top banner.
	 */
	initTopBanner(data) {
		let topBanner = new Banner(this.pixiStage, data);
		this.topBanner = topBanner;
	}

	/**
	 * Handle assets loaded event.
	 */
	assetsLoaded() {
		let mapNames = this.editorConfig.mapNames2D;

		for (let prop in utils.TextureCache) {
			if (prop.indexOf("data:image/") == 0) {
				delete utils.TextureCache[prop];
			}
		}

		for (let name in mapNames) {
			let dt = mapNames[name];
			let uuid = dt.uuid;
			let type = dt.type;

			if (type == "image") {
				if (utils.TextureCache[name]) {
					alert("TextureCache already has a texture with name: " + name + "! please change the name in the editor");
					continue;
				}
				utils.TextureCache[name] = utils.TextureCache[uuid];
			} else if (type == "atlas") {
				Resources[name] = Resources[uuid];
			} else if (type == "spine") {
				if (utils.TextureCache[name]) {
					alert("TextureCache already has a texture with name: " + name + "! please change the name in the editor");
					continue;
				}
				utils.TextureCache[name] = utils.TextureCache[uuid];
			}
		}
	}

	/**
	 * Get all animation names and their associated UUIDs from loaded resources.
	 * @returns {object} - Object containing animation names and UUIDs.
	 */
	getAllAnims() {
		let allAnims = {};
		for (let uuid in Resources) {
			for (let animName in Resources[uuid].animations) {
				allAnims[animName] = uuid;
			}
		}
		return allAnims;
	}

	/**
	 * Initialize the post-processing effects.
	 * @param {object} data - Data for initializing post-process effects.
	 */
	initPostProcess = (data) => {
		let postprocess = new PostProcessing();
		this.postprocess = postprocess;
		this.postprocess.init();
		window.pfUpdatePostProcessValues(data.pfPostprocessData);
	};

	/**
	 * Resize the PIXI canvas and update stage properties accordingly.
	 * @param {number} w - The new width of the canvas.
	 * @param {number} h - The new height of the canvas.
	 */
	resizeCanvas(w, h) {
		let stage = this.pixiStage;

		if (stage.interactive) {
			stage.hitArea = new PIXI.Rectangle(0, 0, w, h);
		}

		let aspectRatio = w / h;
		let squareness = aspectRatio > 1 ? 1 / aspectRatio : aspectRatio;
		let isLandscape = w > h;

		stage.aspectRatio = aspectRatio;
		stage.squareness = squareness;
		stage.isLandscape = isLandscape;
		stage.currentWidth = w;
		stage.currentHeight = h;
		stage.lastWidth = w;
		stage.lastHeight = h;

		this.width = w;
		this.height = h;
		this.aspectRatio = aspectRatio;
		this.squareness = squareness;
		this.isLandscape = isLandscape;

		pf2D.width = w;
		pf2D.height = h;
		pf2D.aspectRatio = aspectRatio;
		pf2D.squareness = squareness;
		pf2D.isLandscape = isLandscape;
	}

	/**
	 * Resize the PIXI canvas and its contents.
	 * @param {number} w - The new width.
	 * @param {number} h - The new height.
	 */
	resize(w, h) {
		let { width, height } = this.responsive.resize(this.pixiApp, w, h);

		this.pixiStage.filterArea = new Rectangle(0, 0, w, h);

		this.resizeCanvas(width, height);
		this.resizeCallback && this.resizeCallback(width, height);
		this.responsive.resizeObjects && this.responsive.resizeObjects(width, height);
		// sceneController.resize(width, height);

		this.postprocess && this.postprocess.resize(width, height);
	}
}

export default Main2D;
