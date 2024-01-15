import Loader from "./loader";
import Responsive from "./responsive";
import globals from "../../../globals";

import WEBGL from "./utils/WebGL";
import Storage from "./utils/storage";
import { Scene, WebGLRenderer, PerspectiveCamera, BufferGeometry, Mesh, FileLoader, Vector3 } from "three";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";

import PostProcessing from "./utils/postprocess/postprocess";
import { AnimManager } from "./utils/anim";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const disableBodyScroll = require("body-scroll-lock").disableBodyScroll;

let THREE = require("three");
window.THREE = THREE;

require("./utils/TrailRenderer");

import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils";
THREE.SkeletonUtils = {
	clone: skeletonClone,
};
import { FileLoaderNoFetch } from "./utils/fileloaderNoFetch";

FileLoader.prototype.load = FileLoaderNoFetch.prototype.load;

class ThreeMain {
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
		let loader = new Loader();
		let responsive = new Responsive(config.resizeData);

		this.loader = loader;
		this.responsive = responsive;

		this.resizeCallback = resizeCallback;
		this.readyCallback = readyCallback;

		let storage = new Storage();
		this.storage = storage;

		let data = globals.data;
		if (data.pfPostprocessData && (data.pfPostprocessData.enable || data.pfPostprocessData.gearboxMode)) {
			let postprocess = new PostProcessing();
			this.postprocess = postprocess;
			globals.postprocess = postprocess;

			postprocess.loadAssets && postprocess.loadAssets();
		}

		this.config = config;

		let num = 0;
		let loadCall = () => {
			num++;
			if (num > 1) {
				this.isReady = true;
				this.init();
				readyCallback();
			}
		};

		this.loadAssets(assets, loadCall);
		this.initRenderer(loadCall);
	}

	init() {
		this.inited = true;

		globals.main.storage = this.storage;

		BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
		BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
		Mesh.prototype.raycast = acceleratedRaycast;

		this.AnimManager = AnimManager;
		globals.main.AnimManager = AnimManager;

		this.initTestControls();

		let controls = this.initControls();
		globals.controls = controls;
		app.controls = controls;
	}

	start() {}

	update(ratio, delta) {
		if (!this.inited || this.contextLost) return;

		if (this.postprocess && this.postprocess.enabled) {
			this.postprocess.update(ratio, delta);
			this.postprocess.render();
		} else {
			this.renderer.render(this.scene, this.camera);
		}
	}

	loadAssets(assets, loadCall) {
		let models = assets[0];
		let textures = assets[1];

		this.loader.loadTextures(this.storage, textures);
		this.loader.loadModels(models, (list) => {
			globals.main.assets = list;
			this.assets = list;
			loadCall();
		});
	}

	initRenderer(loadCall) {
		let config = this.config;

		let webGLReadyCallback = () => {
			let defaultConfig = {
				antialias: false,
				alpha: false,
				powerPreference: "high-performance",
			};

			let rendererConfig = Object.assign(defaultConfig, config.renderer);

			if (rendererConfig.bgType == 2 && app.data.bgSrc) {
				rendererConfig.alpha = true;

				document.body.style.background = "url(" + app.data.bgSrc + ")";
				document.body.style.backgroundSize = "cover";
				document.body.style.backgroundPosition = "center";
			}

			let renderer = new WebGLRenderer(rendererConfig);

			if (!rendererConfig.canvas) {
				let parent = document.getElementById("gameContainer") || document.body;
				parent.appendChild(renderer.domElement);
			}

			let rendererData = globals.editorConfig.threeData.rendererData;
			renderer.outputEncoding = rendererData.outputEncoding;
			renderer.alpha = rendererData.alpha;
			renderer.antialias = rendererData.antialias;
			renderer.physicallyCorrectLights = rendererData.physicallyCorrectLights;
			renderer.toneMapping = rendererData.toneMapping;
			renderer.toneMappingExposure = rendererData.toneMappingExposure;
			renderer.shadowMap.enabled = rendererData.shadowMapEnabled;
			renderer.shadowMap.type = rendererData.shadowMapType;

			if (rendererConfig.bgType == 0) {
				//solid
				renderer.setClearColor(rendererConfig.background, 1);
			} else if (rendererConfig.bgType == 1) {
				//gradient
				renderer.setClearAlpha(0);
				this.setGradientBgColor([rendererConfig.bgGradient1, rendererConfig.bgGradient2]);
			}

			disableBodyScroll(renderer.domElement);

			let camera = new PerspectiveCamera(config.FOV || 75, config.width / config.height, config.cameraNear || 1, config.cameraFar || 1500);

			let scene = new Scene();

			let main = globals.main;

			main.scene = scene;
			main.camera = camera;
			main.renderer = renderer;

			globals.threeScene = scene;
			globals.threeRenderer = renderer;
			globals.threeCamera = camera;

			this.renderer = renderer;
			this.camera = camera;
			this.scene = scene;

			renderer.setSize(config.width, config.height);

			///WebGL context lost
			renderer.getContext().canvas.addEventListener(
				"webglcontextlost",
				(event) => {
					event.preventDefault();
					// animationID would have been set by your call to requestAnimationFrame
					//cancelAnimationFrame(animationID);
					this.contextLost = true;
				},
				false
			);

			renderer.getContext().canvas.addEventListener(
				"webglcontextrestored",
				(event) => {
					// Do something
					this.contextLost = false;
				},
				false
			);

			loadCall();
		};

		let checkWebGL = () => {
			if (!WEBGL.isWebGLAvailable()) {
				setTimeout(() => {
					checkWebGL();
				}, 250);
				return;
			}
			webGLReadyCallback();
		};

		setTimeout(() => {
			checkWebGL();
		}, 50);
	}

	resize(w, h) {
		if (!this.isReady) return;

		let { width, height } = this.responsive.resize(w, h);

		this.resizeCallback(width, height);

		this.postprocess && this.postprocess.resize(app.canvasWidth, app.canvasHeight);

		this.resizeSecondCanvas && this.resizeSecondCanvas(w, h);
	}

	initTestControls() {
		let controls;

		let startOrbitControls = (min = 10, max = 500, maxPolarAngle) => {
			var controls = new OrbitControls(this.camera, document.body);
			//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
			controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
			controls.dampingFactor = 0.25;
			controls.screenSpacePanning = false;

			if (maxPolarAngle !== undefined) {
				controls.maxPolarAngle = maxPolarAngle;
			}
			//controls.maxPolarAngle = maxPolarAngle;

			controls.minDistance = min;
			controls.maxDistance = max;

			return controls;
		};

		this.isTest = false;
		window.onkeydown = (e) => {
			if (e.key == "a" && !this.isTest) {
				this.isTest = true;
				controls = startOrbitControls(0, 1500);
			}

			if (e.key == "s" && this.isTest) {
				this.isTest = false;
				controls.dispose && controls.dispose();
			}
			globals.main.isTest = this.isTest;
		};
	}

	initControls() {
		var controlData = {
			isDown: false,
		};
		var domElement = document.body;

		/////MOUSE CONTROL
		domElement.addEventListener("mousedown", mouseDown);

		function mouseDown(e) {
			/*e.preventDefault();
            e.stopPropagation();*/

			controlData.downX = e.pageX;
			controlData.downY = e.pageY;

			controlData.mouseX = e.pageX;
			controlData.mouseY = e.pageY;

			controlData.prevX = e.pageX;
			controlData.prevY = e.pageY;

			controlData.isDown = true;

			domElement.addEventListener("mouseup", mouseUp);
			domElement.addEventListener("mousemove", mouseMove);
		}

		function mouseMove(e) {
			/*e.preventDefault();
            e.stopPropagation();*/

			controlData.prevX = controlData.mouseX;
			controlData.prevY = controlData.mouseY;

			controlData.mouseX = e.pageX;
			controlData.mouseY = e.pageY;
		}

		function mouseUp(e) {
			/*e.preventDefault();
            e.stopPropagation();*/

			controlData.isDown = false;
			domElement.removeEventListener("mouseup", mouseUp);
			domElement.removeEventListener("mousemove", mouseMove);
		}

		////TOUCH CONTROL
		domElement.addEventListener("touchstart", touchStart);
		function touchStart(e) {
			/*e.preventDefault();
            e.stopPropagation();*/

			controlData.downX = e.touches[0].pageX;
			controlData.downY = e.touches[0].pageY;

			controlData.mouseX = e.touches[0].pageX;
			controlData.mouseY = e.touches[0].pageY;

			controlData.prevX = e.touches[0].pageX;
			controlData.prevY = e.touches[0].pageY;

			controlData.isDown = true;
			domElement.addEventListener("touchend", touchEnd);
			domElement.addEventListener("touchmove", touchMove);
		}

		function touchMove(e) {
			/*e.preventDefault();
            e.stopPropagation();*/

			controlData.prevX = controlData.mouseX;
			controlData.prevY = controlData.mouseY;

			controlData.mouseX = e.touches[0].pageX;
			controlData.mouseY = e.touches[0].pageY;
		}

		function touchEnd(e) {
			/*e.preventDefault();
            e.stopPropagation();*/

			controlData.isDown = false;
			domElement.removeEventListener("touchend", touchEnd);
			domElement.removeEventListener("touchmove", touchMove);
		}

		return controlData;
	}

	setGradientBgColor(colList, colPercs = [20, 60], degVal = 180) {
		let str = "linear-gradient(" + degVal + "deg";

		let i = 0;
		for (let col of colList) {
			str += ", " + col + " " + colPercs[i] + "%";
			i++;
		}

		document.body.style.background = str;
	}

	setCssImage(imgSrc) {
		document.body.style.backgroundImage = "url(" + imgSrc + ")";
		document.body.style.backgroundRepeat = "no-repeat";
		document.body.style.backgroundPosition = "center 70%";
		document.body.style.backgroundSize = "cover";
	}

	initSecondCanvas() {
		let rendererConfig = {
			antialias: false,
			alpha: true,
			powerPreference: "high-performance",
		};

		let renderer = new WebGLRenderer(rendererConfig);
		renderer.domElement.style.zIndex = 5;
		document.body.appendChild(renderer.domElement);

		let camera = new PerspectiveCamera(60, 1, 1, 1500);

		let scene = new Scene();

		globals.main.scene2 = scene;
		globals.main.camera2 = camera;
		globals.main.renderer2 = renderer;

		globals.threeScene2 = scene;
		globals.threeRenderer2 = renderer;
		globals.threeCamera2 = camera;

		this.renderer2 = renderer;
		this.camera2 = camera;
		this.scene2 = scene;

		let resolution = 2;
		let maxDimension = 1000;
		let canvas = renderer.domElement;
		canvas.style.pointerEvents = "none";

		this.resizeSecondCanvas = (iw, ih) => {
			let scale = 1 / resolution;
			let canvasWidth, canvasHeight;

			if (maxDimension && iw * resolution > maxDimension && ih * resolution > maxDimension) {
				var maxWidth = maxDimension;

				scale = Math.min(iw / maxWidth, ih / maxWidth) + 0.0015;
				resolution = 1;

				canvasWidth = Math.ceil(iw / scale);
				canvasHeight = Math.ceil(ih / scale);
			} else {
				canvasWidth = iw * resolution;
				canvasHeight = ih * resolution;
			}

			canvas.style["-ms-transform"] = "scale(" + scale + ")";
			canvas.style["-webkit-transform"] = "scale3d(" + scale + ", 1)";
			canvas.style["-moz-transform"] = "scale(" + scale + ")";
			canvas.style["-o-transform"] = "scale(" + scale + ")";
			canvas.style.transform = "scale(" + scale + ")";
			canvas.style.transformOrigin = "top left";

			var aspect = canvasWidth / canvasHeight;
			camera.aspect = aspect;
			camera.updateProjectionMatrix();
			renderer.setSize(canvasWidth, canvasHeight);

			app.canvasWidth = canvasWidth;
			app.canvasHeight = canvasHeight;
		};
	}
}

export default ThreeMain;
