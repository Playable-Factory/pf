import Loader2D from "./loader";
import Responsive from "./responsive";
import PostProcessing from "./utils/postprocess/postprocess";

import * as PIXI from "pixi.js-legacy";

import gsap from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
import CustomEase from "gsap/CustomEase";
import { utils, Loader, Rectangle } from "pixi.js-legacy";
import Banner from "./utils/banner";
import gx from "pf.js/src/2d";

const Resources = Loader.shared.resources;

class Main2D {
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

		let scene = gx.init(app, editorConfig, utils.TextureCache, Resources);
		this.pixiApp = app;
		this.pixiScene = scene;
		this.scene = scene;

		let loader = new Loader2D();
		this.responsive = new Responsive(app, scene);

		loader.load(assets.normal, () => {
			this.assetsLoaded();
			setTimeout(() => {
				readyCallback();
			}, 100);
			// this.initPostProcess();
		});
	}

	pause() {
		gsap.ticker.sleep();
	}

	resume() {
		gsap.ticker.wake();
	}

	update(time, delta) {
		this.updateCallback && this.updateCallback(time, delta);
		gx.scene.update(time, delta);
		// console.log(gx.scene);
	}

	render() {
		this.pixiApp.ticker.update();
	}

	initTopBanner(data) {
		let topBanner = new Banner(this.pixiScene, data);
		this.topBanner = topBanner;
	}

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

	getAllAnims() {
		let allAnims = {};
		for (let uuid in Resources) {
			for (let animName in Resources[uuid].animations) {
				allAnims[animName] = uuid;
			}
		}
		return allAnims;
	}

	initPostProcess = (data) => {
		let postprocess = new PostProcessing();
		this.postprocess = postprocess;
		this.postprocess.init();
		window.pfUpdatePostProcessValues(data.pfPostprocessData);
	};

	resizeCanvas(w, h) {
		let scene = this.pixiScene;

		if (scene.interactive) {
			scene.hitArea = new PIXI.Rectangle(0, 0, w, h);
		}

		let aspectRatio = w / h;
		let squareness = aspectRatio > 1 ? 1 / aspectRatio : aspectRatio;
		let isLandscape = w > h;

		scene.aspectRatio = aspectRatio;
		scene.squareness = squareness;
		scene.isLandscape = isLandscape;
		scene.currentWidth = w;
		scene.currentHeight = h;
		scene.lastWidth = w;
		scene.lastHeight = h;
	}

	resize(w, h) {
		let { width, height } = this.responsive.resize(this.pixiApp, w, h);

		this.pixiScene.filterArea = new Rectangle(0, 0, w, h);

		this.resizeCanvas(width, height);
		this.resizeCallback && this.resizeCallback(width, height);
		this.responsive.resizeObjects && this.responsive.resizeObjects(width, height);
		// sceneController.resize(width, height);

		this.postprocess && this.postprocess.resize(width, height);
	}
}

export default Main2D;
