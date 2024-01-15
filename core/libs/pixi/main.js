import globals from "../../../globals";

import Loader from "./loader";
import Responsive from "./responsive";

import gsap from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
import CustomEase from "gsap/CustomEase";
import HelperPrototypes from "./HelperPrototypes";
//import PredefinedTweens from "./PredefinedTweens";
import sceneController from "../../../game/pixi/editor/sceneController";
import PhaserTween from "./phaserTween";
import PostProcessing from "./utils/postprocess/postprocess";

class PixiMain {
	constructor(config, assets, readyCallback, resizeCallback) {
		if (app.type == "voodoo_notion") {
			this.delayedStartLibrary = () => {
				this.startLibrary(config, assets, readyCallback, resizeCallback);
			};
		} else {
			this.startLibrary(config, assets, readyCallback, resizeCallback);
		}
	}

	startLibrary(config, assets, readyCallback, resizeCallback) {
		globals.gltfAssets = {};
		let loader = new Loader();
		this.responsive = new Responsive();

		this.resizeCallback = resizeCallback;

		let tempConfig = {
			width: 800,
			height: 800,
			resolution: 1, //window.devicePixelRatio || 1,
			antialias: false,
			forceCanvas: false,
		};

		config = Object.assign(tempConfig, config);

		new HelperPrototypes();

		PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2;
		const app = new PIXI.Application(config);
		let parent = document.getElementById("gameContainer") || document.body;
		parent.appendChild(app.view);
		// document.body.appendChild(app.view);
		globalThis.__PIXI_APP__ = app;
		
		gsap.registerPlugin(PixiPlugin, CustomEase);
		PixiPlugin.registerPIXI(PIXI);
		window.PIXI = PIXI; // for dev-tools
		globals.gsap = gsap; // for ec builder
		app.ticker.stop();
		gsap.ticker.add((time, delta) => {
			app.ticker.update();
			this.postprocess && this.postprocess.update(time, delta / 1000);
		});

		globals.pixiApp = app;
		globals.pixiScene = app.stage;

		app.stage.interactive = true;
		app.stage.sortableChildren = true;

		new PhaserTween(app);
		//new PredefinedTweens();
		let isFirstTime = true;

		let initPostProcess = () => {
			let data = globals.data;
			if (!globals.libs.threeMain && data.pfPostprocessData && (data.pfPostprocessData.enable || data.pfPostprocessData.gearboxMode)) {
				let postprocess = new PostProcessing();
				this.postprocess = postprocess;
				globals.pixiPostprocess = postprocess;
			}

			if (this.postprocess) {
				this.postprocess.init();

				if (isFirstTime) {
					window.pfUpdatePostProcessValues(data.pfPostprocessData);
					isFirstTime = false;
				}
			}
		};

		loader.load(assets, () => {
			readyCallback();
			initPostProcess();
		});
	}

	resize(w, h) {
		let { width, height } = this.responsive.resize(globals.pixiApp, w, h);

		this.resizeCallback && this.resizeCallback(width, height);
		this.responsive.resizeObjects && this.responsive.resizeObjects(width, height);
		sceneController.resize(width, height);

		this.postprocess && this.postprocess.resize(width, height);
	}
}

export default PixiMain;
