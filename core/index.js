import "./css/style_core.css";
// import "./css/preloader-pf.css";
import "./css/style.css";
import "./css/custom_preloader.css";

import globals from "../globals";
import Assets from "../assets";
import TemplateMain from "./utils/main";
import soundHelper from "./utils/soundHelper";
import MarketHelper from "./utils/market";
import GeneralLoader from "./utils/loader";

let data = globals.data;

let assets = new Assets(data);
let libs = {};
let enableUpdates = false;

globals.libs = libs;

// #if process.pfData.enableThreeJs
import ThreeMain from "./libs/three/main";
import ThreeGame from "../game/three/game";
import { Clock } from "three";
//import Stats from "stats.js";
// #endif

// #if process.pfData.enablePixi
app.isPixiTemplate = true;
import PixiMain from "./libs/pixi/main";
import PixiGame from "../game/pixi/game";
import { gsap } from "gsap";
// #endif

let initGame = (enableWait, callback) => {
	////////////////////////////
	////////THREE JS////////////
	////////////////////////////

	// #if process.pfData.enableThreeJs

	/** @type {ThreeGame} */
	let threeGame;
	/** @type {ThreeMain} */
	let threeMain = new ThreeMain(
		globals.threeConfig,
		[assets.threejsModels, assets.threejsTextures],
		////ready callback
		() => {
			threeGame = new ThreeGame();
			libs.threeGame = threeGame;
			readyCallback("three");
		},
		////resize callback
		(w, h) => {
			threeGame.resize(w, h);
		}
	);

	libs.threeMain = threeMain;

	let clock = new Clock(true);

	let customUpdate = () => {
		requestAnimationFrame(customUpdate);
		if (app.iecStarted) return;

		let delta = clock.getDelta();
		if (!delta || isNaN(delta)) delta = 0.01;
		if (delta > 0.03) delta = 0.03;
		let ratio = delta * 60;

		if (enableUpdates) {
			libs.threeGame && libs.threeGame.update(ratio, delta);
			libs.threeMain.update(ratio, delta);
		}
	};
	customUpdate();

	// #endif

	////////////////////////////
	////////PIXI JS/////////////
	////////////////////////////

	// #if process.pfData.enablePixi
	app.isPixiTemplate = true;

	/** @type {PixiGame} */
	let pixiGame;
	/** @type {PixiMain} */
	let pixiMain = new PixiMain(
		globals.pixiConfig,
		assets.pixiAssets,
		////ready callback
		() => {
			assets.pixiAssetsLoaded();
			pixiGame = new PixiGame();
			libs.pixiGame = pixiGame;

			globals.pixiApp.view.style.zIndex = 1;

			libs.pixiGame.initTicker = () => {
				globals.pixiApp.ticker.add((delta) => {
					const msec = delta / PIXI.settings.TARGET_FPMS;
					//const sec = msec / 1000.0;
					pixiGame.update(globals.pixiApp.ticker.lastTime, msec);
				});
			};
			readyCallback("pixi");
		},
		////resize callback
		(w, h) => {
			if (!pixiGame) return;

			let scene = globals.pixiApp.stage;

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

			pixiGame.resize(w, h);
		}
	);

	libs.pixiMain = pixiMain;

	// #endif

	////////////////////////////
	////////MAIN CONFIG/////////
	////////////////////////////

	let config = {
		totalTime: 0,

		nucleo: globals.generalConfig.nucleo,
		tapjoy: globals.generalConfig.tapjoy,

		networkReady: () => {
			if (app.type == "voodoo_notion") {
				networkReady = true;
				readyCallback("network");
			} else if (app.type == "mobvista") {
			} else {
				networkReady = true;
				allReady();
			}
		},

		gameResized: (w, h) => {
			///screen width and height
			globals.screenWidth = w;
			globals.screenHeight = h;

			app.documentWidth = w;
			app.documentHeight = h;

			libs.threeMain && libs.threeMain.resize(w, h);
			libs.pixiMain && libs.pixiMain.resize(w, h);
		},

		gamePaused: function () {
			window.Howler && window.Howler.mute(true);
		},

		gameContinue: function () {
			if (globals.audioIcon) {
				if (main.soundEnabled && globals.audioIcon && !globals.audioIcon.muted) {
					window.Howler && window.Howler.mute(false);
					globals.audioIcon && globals.audioIcon.unMuteIcon();
				}
			} else {
				if (main.soundEnabled) {
					window.Howler && window.Howler.mute(false);
					globals.audioIcon && globals.audioIcon.unMuteIcon();
				}
			}
		},

		timeUp: function () {
			////TIME UP
			globals.generalConfig.timeUp();
		},

		soundChanged: function () {
			if (main.soundEnabled) {
				window.Howler && window.Howler.mute(false);
			} else {
				window.Howler && window.Howler.mute(true);
			}
		},

		////Restart Game function for Voodoo
		restartGame: function () {
			globals.generalConfig.restartGame();
		},
	};

	let numOfReady = 0;
	let total = 0;
	if (libs.threeMain) total++;
	if (libs.pixiMain) total++;

	let librariesInited = false;
	let networkReady = false;

	let initLibraries = () => {
		soundHelper.initTempFunctions();

		main.resizeNow();
		libs.threeGame && libs.threeGame.init();
		libs.pixiGame && libs.pixiGame.init();

		gsap.ticker.sleep();
		gsap.ticker.tick();

		if (libs.threeGame && libs.threeMain && libs.threeMain.postprocess) {
			libs.threeMain.postprocess.init();
		}

		enableUpdates = false;

		if (libs.threeMain) {
			libs.threeMain.update();
		}
		librariesInited = true;
		allReady();
	};

	let letsGo = () => {
		/////Sound Helper
		let initSoundHelper = () => {
			soundHelper.initDefault();
			soundHelper.initTTS();
			app.playMusic();
		};

		if (data.playSoundAfterFirstTouch) {
			let tempEvent = () => {
				initSoundHelper();
				window.removeEventListener("touchstart", tempEvent);
				window.removeEventListener("mousedown", tempEvent);
			};
			window.addEventListener("touchstart", tempEvent);
			window.addEventListener("mousedown", tempEvent);
		} else {
			initSoundHelper();
		}

		main.gameInited();
		main.resizeNow();

		if (libs.pixiGame) {
			libs.pixiGame.initTicker();
			gsap.ticker.wake();
		}

		if (libs.threeGame) {
			libs.threeGame.updateEnabled = true;
		}
		enableUpdates = true;

		//main.resizeNow();
		setTimeout(() => {
			main.gameStarted();
			main.hidePreloader();
		}, 1);
		////do not start market options
		if (main.networkHelper && main.networkHelper.disableMarketOptions) {
		} else {
			///init market functions
			MarketHelper.initMarketFunctions(data);
		}
	};

	let allReady = () => {
		if (!networkReady || !librariesInited) return;
		// console.log("ALL READY");
		if (enableWait) {
			callback(letsGo);
			setTimeout(() => {
				main.hidePreloader();
			}, 1000);
		} else {
			letsGo();
			main.hidePreloader();
		}
	};

	let readyCallback = (name) => {
		numOfReady++;

		if (numOfReady >= total) {
			if (data.enableCustomPreloader) {
				setTimeout(() => {
					initLibraries();
				}, data.customPreloaderDuration * 1000);
			} else {
				initLibraries();
			}

			if (app.type == "mobvista") {
				window.mobvistaGameReady && window.mobvistaGameReady();
				window.mobvistaGameReady = null;
			}
		}

		// if (app.type == "mobvista" && numOfReady == total - 1) {
		// 	window.mobvistaGameReady && window.mobvistaGameReady();
		// 	window.mobvistaGameReady = null;
		// }

		if (app.type == "voodoo_notion" && name == "network") {
			if (window.DCOSDK) for (let a in window.DCOSDK.parameters) data[a] = window.DCOSDK.parameters[a];

			libs.pixiMain && libs.pixiMain.delayedStartLibrary();
			libs.threeMain && libs.threeMain.delayedStartLibrary();
		}
	};

	if (app.type == "mobvista") {
		app.gameStart = function () {
			app.mobvistaStarted = true;
			networkReady = true;
			allReady();
		};

		app.gameClose = function () {
			app.stopMusic && app.stopMusic();
			app.main.soundEnabled = false;
		};
	} else if (app.type == "voodoo_notion") {
		total++;
	}

	let main = new TemplateMain(config);
	globals.main = main;
	app.main = main;

	globals.restartCallback = (didWon) => {
		globals.retryMarketFunctions && globals.retryMarketFunctions(didWon);
		main.restartGame(data.totalTime);
	};

	globals.endCallback = (didWon) => {
		main.gameFinished(didWon);
	};

	let mainUpdate = () => {
		requestAnimationFrame(mainUpdate);
		main.update();
	};
	mainUpdate();

	///LOAD NON LIBRARY THINGS
	let generalItemsReady = false;
	total++;
	GeneralLoader.load(assets.generalAssets, () => {
		if (generalItemsReady) return;
		generalItemsReady = true;
		readyCallback();
	});

	setTimeout(() => {
		if (generalItemsReady) return;
		generalItemsReady = true;
		readyCallback();
	}, 3000);
};

export default initGame;
// ////CHECK FONT LOADING
// let fontsAreReady = false;
// total++;
// document.fonts.ready.then(function () {
//     if (fontsAreReady) return;
//     fontsAreReady = true;
//     readyCallback();
//     console.log('All fonts  have loaded.');
// });

// setTimeout(() => {
//     if (fontsAreReady) return;
//     fontsAreReady = true;
//     readyCallback();
//     console.log('set timeout for font');
// }, 3000);
